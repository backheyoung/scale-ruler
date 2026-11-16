/**
 * ScaleRuler Pro - 컴퓨터용 정밀 화면 자 & CAD 도면 배율 측정기
 * 100% Client-Side Processing (업로드한 이미지는 서버로 절대 전송되지 않습니다)
 */

// ============================================================================
// 💰 [광고 수익화 설정 (Google AdSense / Kakao AdFit)]
// 애드센스 또는 카카오 애드핏 승인 후 아래 설정값만 입력하면 광고가 자동 표시됩니다.
// ============================================================================
const AD_CONFIG = {
    enabled: false, // 광고 승인 후 true 로 변경하세요
    provider: 'adsense', // 'adsense' 또는 'adfit'
    adsenseClient: 'ca-pub-0000000000000000', // 본인 애드센스 게시자 ID
    adsenseSlotSidebar: '0000000000',         // 사이드바 광고 단위 ID
    adsenseSlotBanner: '0000000000',          // 하단 배너 광고 단위 ID
    adfitUnitSidebar: 'DAN-xxxxxxxxxxxxxxxx', // 카카오 애드핏 사이드바 단위 ID
    adfitUnitBanner: 'DAN-yyyyyyyyyyyyyyyy'   // 카카오 애드핏 배너 단위 ID
};

document.addEventListener('DOMContentLoaded', () => {
    // --- 단위 환산 상수 (내부 계산 기준: mm) ---
    const UNIT_TO_MM = {
        mm: 1,
        cm: 10,
        m: 1000,
        inch: 25.4
    };
    const M2_PER_PYEONG = 3.305785;

    // --- 애플리케이션 상태 ---
    const state = {
        mode: 'measure',          // 'calibrate' | 'measure' | 'area' | 'poly' | 'angle' | 'pan'
        displayUnit: 'mm',        // 'mm' | 'cm' | 'm' | 'inch' | 'px'

        // 배율(Scale) 보정 상태: refPx 픽셀 = refRealValue (refRealUnit)
        refPx: 100,
        refRealValue: 100,
        refRealUnit: 'mm',
        mmPerPixel: 1.0,

        // 기준선 및 임시 점
        calibLine: null,          // { x1, y1, x2, y2 }
        tempPoints: [],
        mouseWorld: { x: 0, y: 0 },
        mouseScreen: { x: 0, y: 0 },
        isShiftDown: false,
        isSpaceDown: false,

        // 측정 완료 항목들: [{ id, type: 'distance'|'area'|'poly'|'angle', points: [{x,y},...], name: string }]
        measurements: [],
        nextId: 1,

        // 끝점 드래그 미세 수정 상태
        draggingHandle: null,     // { target: 'calib'|'measurement', mIndex, ptIndex }
        hoveredHandle: null,

        // 캔버스 뷰포트 변환 (Zoom & Pan)
        zoom: 1.0,
        panX: 0,
        panY: 0,
        isPanning: false,
        panStartMouse: { x: 0, y: 0 },
        panStartOffset: { x: 0, y: 0 },

        // 배경 도면/이미지
        bgImage: null,
        bgOpacity: 1.0,

        // 플로팅 눈금자 상태
        rulerVisible: true,
        rulerOrientation: 'horizontal', // 'horizontal' | 'vertical'
        rulerX: 60,
        rulerY: 380,
        rulerLength: 660,
        rulerBreadth: 86,
        rulerOpacityMode: 0,            // 0: 90%, 1: 60%, 2: 100%
        rulerPins: [],                  // 눈금자 위 클릭 고정 핀 [worldDistPx1, worldDistPx2]

        // 돋보기 배율
        loupeZoom: 4
    };

    // --- DOM 요소 참조 ---
    const viewport = document.getElementById('canvas-viewport');
    const mainCanvas = document.getElementById('main-canvas');
    const ctx = mainCanvas.getContext('2d');

    const loupeCanvas = document.getElementById('loupe-canvas');
    const loupeCtx = loupeCanvas.getContext('2d');
    const loupeCoord = document.getElementById('loupe-coord');
    const btnLoupeZoom = document.getElementById('btn-loupe-zoom');

    const calibPopup = document.getElementById('calibration-popup');
    const calibPopupPx = document.getElementById('calib-popup-px');
    const inputCalibValue = document.getElementById('input-calib-value');
    const selectCalibUnit = document.getElementById('select-calib-unit');

    const floatingRuler = document.getElementById('floating-ruler');
    const rulerCanvas = document.getElementById('floating-ruler-canvas');
    const rulerCtx = rulerCanvas.getContext('2d');
    const rulerLaser = document.getElementById('ruler-laser');
    const rulerLaserBadge = document.getElementById('ruler-laser-badge');
    const rulerScaleLabel = document.getElementById('ruler-scale-label');
    const rulerResizeGrip = document.getElementById('ruler-resize-grip');
    const btnRulerPinClear = document.getElementById('btn-ruler-pin-clear');

    // 푸터 연도 표시
    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // --- 로컬 스토리지에서 이전 배율/테마 설정 복원 ---
    try {
        const savedTheme = localStorage.getItem('sr_theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.add('light-mode');
        }
        const savedScale = localStorage.getItem('sr_scale');
        if (savedScale) {
            const parsed = JSON.parse(savedScale);
            if (parsed.refPx > 0 && parsed.refRealValue > 0 && UNIT_TO_MM[parsed.refRealUnit]) {
                state.refPx = parsed.refPx;
                state.refRealValue = parsed.refRealValue;
                state.refRealUnit = parsed.refRealUnit;
                state.displayUnit = parsed.displayUnit || parsed.refRealUnit;
                document.getElementById('select-unit').value = state.displayUnit;
            }
        }
        const cookieAccepted = localStorage.getItem('sr_cookie_consent');
        if (!cookieAccepted) {
            document.getElementById('cookie-banner').classList.remove('hidden');
        }
    } catch (err) {
        // 스토리지 차단 환경 무시
    }

    document.getElementById('btn-accept-cookies').addEventListener('click', () => {
        try { localStorage.setItem('sr_cookie_consent', '1'); } catch (e) {}
        document.getElementById('cookie-banner').classList.add('hidden');
    });

    // --- 토스트 메시지 ---
    let toastTimeout = null;
    function showToast(msg) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-text').textContent = msg;
        toast.classList.remove('opacity-0');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add('opacity-0');
        }, 2800);
    }

    // --- 좌표 변환 함수 ---
    function screenToWorld(sx, sy) {
        return {
            x: (sx - state.panX) / state.zoom,
            y: (sy - state.panY) / state.zoom
        };
    }

    function worldToScreen(wx, wy) {
        return {
            x: wx * state.zoom + state.panX,
            y: wy * state.zoom + state.panY
        };
    }

    function applyOrthoSnap(startPt, currentPt) {
        if (!state.isShiftDown || !startPt) return currentPt;
        const dx = currentPt.x - startPt.x;
        const dy = currentPt.y - startPt.y;
        const angle = Math.atan2(dy, dx);
        const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
        const dist = Math.hypot(dx, dy);
        return {
            x: startPt.x + Math.cos(snapAngle) * dist,
            y: startPt.y + Math.sin(snapAngle) * dist
        };
    }

    // --- 단위 포맷팅 ---
    function formatWorldDistance(pxDist, includeUnit = true) {
        if (state.displayUnit === 'px') {
            return `${pxDist.toFixed(1)}${includeUnit ? ' px' : ''}`;
        }
        const mmVal = pxDist * state.mmPerPixel;
        const converted = mmVal / UNIT_TO_MM[state.displayUnit];
        let decimals = 1;
        if (state.displayUnit === 'cm') decimals = 2;
        else if (state.displayUnit === 'm') decimals = 3;
        else if (state.displayUnit === 'inch') decimals = 2;
        else if (converted < 10) decimals = 2;

        return `${converted.toFixed(decimals)}${includeUnit ? ' ' + state.displayUnit : ''}`;
    }

    function formatArea(widthPx, heightPx) {
        if (state.displayUnit === 'px') {
            const areaPx = widthPx * heightPx;
            return {
                main: `${Math.round(areaPx).toLocaleString()} px²`,
                sub: `${widthPx.toFixed(0)} × ${heightPx.toFixed(0)} px`,
                pyeong: '-'
            };
        }
        const wMm = widthPx * state.mmPerPixel;
        const hMm = heightPx * state.mmPerPixel;
        const areaM2 = (wMm * hMm) / 1_000_000;
        const pyeong = areaM2 / M2_PER_PYEONG;

        let mainStr = '';
        if (areaM2 >= 0.05) {
            mainStr = `${areaM2.toFixed(2)} m² (${pyeong.toFixed(2)}평)`;
        } else {
            const areaCm2 = (wMm * hMm) / 100;
            mainStr = `${areaCm2.toFixed(1)} cm²`;
        }
        return {
            main: mainStr,
            sub: `가로 ${formatWorldDistance(widthPx)} × 세로 ${formatWorldDistance(heightPx)}`,
            pyeong: `${pyeong.toFixed(2)}평`
        };
    }

    // --- 배율 재계산 및 UI 동기화 ---
    function recalculateScale() {
        const realMm = state.refRealValue * UNIT_TO_MM[state.refRealUnit];
        state.mmPerPixel = realMm / state.refPx;

        const unit = state.displayUnit === 'px' ? state.refRealUnit : state.displayUnit;
        const perPxInDisplayUnit = state.mmPerPixel / (UNIT_TO_MM[unit] || 1);

        document.getElementById('badge-scale-status').textContent =
            `기준 ${state.refPx.toFixed(1)} px = ${state.refRealValue} ${state.refRealUnit} (1 px = ${perPxInDisplayUnit.toFixed(4)} ${unit})`;

        document.getElementById('sidebar-ref-px').textContent = `${state.refPx.toFixed(1)} px`;
        document.getElementById('sidebar-ref-real').textContent = `${state.refRealValue} ${state.refRealUnit}`;
        document.getElementById('sidebar-scale-factor').textContent = `1 px = ${perPxInDisplayUnit.toFixed(4)} ${unit}`;

        try {
            localStorage.setItem('sr_scale', JSON.stringify({
                refPx: state.refPx,
                refRealValue: state.refRealValue,
                refRealUnit: state.refRealUnit,
                displayUnit: state.displayUnit
            }));
        } catch (e) {}

        renderMeasurementList();
        updateFloatingRuler();
        renderMainCanvas();
    }

    // --- 모드 전환 ---
    function setMode(newMode) {
        state.mode = newMode;
        state.tempPoints = [];
        calibPopup.classList.add('hidden');

        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active', 'active-calib', 'active-area', 'active-poly');
        });

        const guideText = document.getElementById('mode-guide-text');
        const liveTypeBadge = document.getElementById('live-type-badge');
        const liveMainLabel = document.getElementById('live-main-label');

        if (newMode === 'calibrate') {
            const btn = document.getElementById('btn-mode-calibrate');
            btn.classList.add('active-calib');
            btn.classList.remove('pulse-highlight');
            guideText.textContent = '[1단계: 배율 설정] 실제 치수를 아는 구간의 시작점(1)과 끝점(2)을 클릭하세요. (Shift: 수평/수직 스냅)';
            liveTypeBadge.textContent = '배율 보정';
            liveMainLabel.textContent = '기준 거리:';
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'measure') {
            document.getElementById('btn-mode-measure').classList.add('active');
            guideText.textContent = '[거리 측정] 길이를 잴 두 지점(시작점 → 끝점)을 클릭하세요. (Shift: 직각 스냅, 끝점 마커 드래그 수정 가능)';
            liveTypeBadge.textContent = '거리 측정';
            liveMainLabel.textContent = '실제 거리 (ΔL):';
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'area') {
            document.getElementById('btn-mode-area').classList.add('active-area');
            guideText.textContent = '[면적·평수 측정] 방이나 사각형 영역의 대각선 모서리 두 점(시작 모서리 → 반대쪽 모서리)을 클릭하세요.';
            liveTypeBadge.textContent = '면적·평수';
            liveMainLabel.textContent = '면적 (㎡·평):';
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'poly') {
            document.getElementById('btn-mode-poly').classList.add('active-poly');
            guideText.textContent = '[연속 구간 측정] 여러 지점을 순서대로 클릭하고, 끝내려면 [우클릭] 또는 [Enter]를 누르세요.';
            liveTypeBadge.textContent = '연속 거리';
            liveMainLabel.textContent = '누적 총길이:';
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'angle') {
            document.getElementById('btn-mode-angle').classList.add('active');
            guideText.textContent = '[각도 측정] 시작점(1) → 꼭짓점(2) → 끝점(3) 순서로 세 지점을 클릭하세요.';
            liveTypeBadge.textContent = '각도 측정';
            liveMainLabel.textContent = '측정 각도:';
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'pan') {
            document.getElementById('btn-mode-pan').classList.add('active');
            guideText.textContent = '[화면 이동 모드] 마우스를 드래그하여 도면 위치를 이동하고, 마우스 휠로 확대/축소하세요.';
            liveTypeBadge.textContent = '화면 이동';
            viewport.style.cursor = 'grab';
        }

        renderMainCanvas();
    }

    document.getElementById('btn-mode-calibrate').addEventListener('click', () => setMode('calibrate'));
    document.getElementById('btn-mode-measure').addEventListener('click', () => setMode('measure'));
    document.getElementById('btn-mode-area').addEventListener('click', () => setMode('area'));
    document.getElementById('btn-mode-poly').addEventListener('click', () => setMode('poly'));
    document.getElementById('btn-mode-angle').addEventListener('click', () => setMode('angle'));
    document.getElementById('btn-mode-pan').addEventListener('click', () => setMode('pan'));
    document.getElementById('btn-recalibrate').addEventListener('click', () => {
        setMode('calibrate');
        showToast('기준점 2점을 화면에서 클릭해 주세요.');
    });

    document.getElementById('select-unit').addEventListener('change', (e) => {
        state.displayUnit = e.target.value;
        recalculateScale();
    });

    // --- 끝점 핸들 히트 테스트 (이미 찍은 점 마우스로 드래그 수정) ---
    function findHandleAtScreenPos(sx, sy) {
        const hitRadius = 9;
        // 측정 항목들의 각 점 검사
        for (let i = state.measurements.length - 1; i >= 0; i--) {
            const m = state.measurements[i];
            for (let pIdx = 0; pIdx < m.points.length; pIdx++) {
                const sp = worldToScreen(m.points[pIdx].x, m.points[pIdx].y);
                if (Math.hypot(sp.x - sx, sp.y - sy) <= hitRadius) {
                    return { target: 'measurement', mIndex: i, ptIndex: pIdx };
                }
            }
        }
        // 기준선 양 끝점 검사
        if (state.calibLine) {
            const p1 = worldToScreen(state.calibLine.x1, state.calibLine.y1);
            if (Math.hypot(p1.x - sx, p1.y - sy) <= hitRadius) {
                return { target: 'calib', ptIndex: 1 };
            }
            const p2 = worldToScreen(state.calibLine.x2, state.calibLine.y2);
            if (Math.hypot(p2.x - sx, p2.y - sy) <= hitRadius) {
                return { target: 'calib', ptIndex: 2 };
            }
        }
        return null;
    }

    // --- 메인 캔버스 리사이즈 & 렌더링 ---
    function resizeMainCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = viewport.getBoundingClientRect();
        mainCanvas.width = rect.width * dpr;
        mainCanvas.height = rect.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        renderMainCanvas();
        updateFloatingRuler();
    }

    function renderMainCanvas() {
        const width = viewport.clientWidth;
        const height = viewport.clientHeight;
        ctx.clearRect(0, 0, width, height);

        // 1. 배경 모눈 그리드
        drawGrid(width, height);

        // 2. 배경 도면 이미지
        if (state.bgImage) {
            ctx.save();
            ctx.globalAlpha = state.bgOpacity;
            ctx.translate(state.panX, state.panY);
            ctx.scale(state.zoom, state.zoom);
            ctx.drawImage(state.bgImage, 0, 0);
            ctx.restore();
        }

        // 3. 기준선(Calibration Line)
        if (state.calibLine) {
            const p1 = worldToScreen(state.calibLine.x1, state.calibLine.y1);
            const p2 = worldToScreen(state.calibLine.x2, state.calibLine.y2);
            const label = `기준선: ${state.refRealValue}${state.refRealUnit} (${state.refPx.toFixed(1)}px)`;
            drawDimensionLineScreen(p1, p2, label, '#f59e0b', true);
        }

        // 4. 저장된 측정 항목들 렌더링
        state.measurements.forEach((m, idx) => {
            const prefix = m.name ? `${m.name}: ` : `#${idx + 1} `;
            if (m.type === 'distance') {
                const p1 = worldToScreen(m.points[0].x, m.points[0].y);
                const p2 = worldToScreen(m.points[1].x, m.points[1].y);
                const distPx = Math.hypot(m.points[1].x - m.points[0].x, m.points[1].y - m.points[0].y);
                const label = `${prefix}${formatWorldDistance(distPx)}`;
                drawDimensionLineScreen(p1, p2, label, '#38bdf8', false);
            } else if (m.type === 'area') {
                const p1 = worldToScreen(m.points[0].x, m.points[0].y);
                const p2 = worldToScreen(m.points[1].x, m.points[1].y);
                const wPx = Math.abs(m.points[1].x - m.points[0].x);
                const hPx = Math.abs(m.points[1].y - m.points[0].y);
                const areaInfo = formatArea(wPx, hPx);
                drawAreaRectScreen(p1, p2, `${prefix}${areaInfo.main}`, formatWorldDistance(wPx), formatWorldDistance(hPx), '#10b981');
            } else if (m.type === 'poly') {
                const screenPts = m.points.map(pt => worldToScreen(pt.x, pt.y));
                let totalPx = 0;
                for (let i = 1; i < m.points.length; i++) {
                    totalPx += Math.hypot(m.points[i].x - m.points[i - 1].x, m.points[i].y - m.points[i - 1].y);
                }
                drawPolylineScreen(screenPts, `${prefix}총 ${formatWorldDistance(totalPx)}`, '#06b6d4', false);
            } else if (m.type === 'angle') {
                const p1 = worldToScreen(m.points[0].x, m.points[0].y);
                const vertex = worldToScreen(m.points[1].x, m.points[1].y);
                const p3 = worldToScreen(m.points[2].x, m.points[2].y);
                const deg = calculateAngleDeg(m.points[0], m.points[1], m.points[2]);
                drawAngleScreen(p1, vertex, p3, `${prefix}${deg.toFixed(1)}°`, '#c084fc');
            }
        });

        // 5. 호버 중인 끝점 하이라이트 링 표시
        if (state.hoveredHandle && state.tempPoints.length === 0) {
            let hPt = null;
            if (state.hoveredHandle.target === 'measurement') {
                const m = state.measurements[state.hoveredHandle.mIndex];
                if (m) hPt = worldToScreen(m.points[state.hoveredHandle.ptIndex].x, m.points[state.hoveredHandle.ptIndex].y);
            } else if (state.hoveredHandle.target === 'calib' && state.calibLine) {
                hPt = state.hoveredHandle.ptIndex === 1
                    ? worldToScreen(state.calibLine.x1, state.calibLine.y1)
                    : worldToScreen(state.calibLine.x2, state.calibLine.y2);
            }
            if (hPt) {
                ctx.save();
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(hPt.x, hPt.y, 9, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        // 6. 현재 클릭 진행 중인 임시 도형 그리기
        if (state.tempPoints.length > 0) {
            const lastPt = state.tempPoints[state.tempPoints.length - 1];
            const snappedWorld = applyOrthoSnap(lastPt, state.mouseWorld);

            if (state.mode === 'calibrate' || state.mode === 'measure') {
                const p1 = worldToScreen(state.tempPoints[0].x, state.tempPoints[0].y);
                const p2 = worldToScreen(snappedWorld.x, snappedWorld.y);
                const distPx = Math.hypot(snappedWorld.x - state.tempPoints[0].x, snappedWorld.y - state.tempPoints[0].y);
                const color = state.mode === 'calibrate' ? '#fbbf24' : '#34d399';
                const label = state.mode === 'calibrate'
                    ? `기준 구간: ${distPx.toFixed(1)} px (클릭하여 수치 입력)`
                    : `${formatWorldDistance(distPx)} (${distPx.toFixed(1)}px)`;
                drawDimensionLineScreen(p1, p2, label, color, true);
                updateLiveReadout(state.tempPoints[0], snappedWorld, 'distance');
            } else if (state.mode === 'area') {
                const p1 = worldToScreen(state.tempPoints[0].x, state.tempPoints[0].y);
                const p2 = worldToScreen( state.mouseWorld.x, state.mouseWorld.y );
                const wPx = Math.abs(state.mouseWorld.x - state.tempPoints[0].x);
                const hPx = Math.abs(state.mouseWorld.y - state.tempPoints[0].y);
                const areaInfo = formatArea(wPx, hPx);
                drawAreaRectScreen(p1, p2, areaInfo.main, formatWorldDistance(wPx), formatWorldDistance(hPx), '#10b981', true);
                updateLiveReadout(state.tempPoints[0], state.mouseWorld, 'area');
            } else if (state.mode === 'poly') {
                const allWorld = [...state.tempPoints, snappedWorld];
                const screenPts = allWorld.map(pt => worldToScreen(pt.x, pt.y));
                let totalPx = 0;
                for (let i = 1; i < allWorld.length; i++) {
                    totalPx += Math.hypot(allWorld[i].x - allWorld[i - 1].x, allWorld[i].y - allWorld[i - 1].y);
                }
                drawPolylineScreen(screenPts, `누적: ${formatWorldDistance(totalPx)} (우클릭 완료)`, '#22d3ee', true);
                updateLiveReadout(lastPt, snappedWorld, 'distance', totalPx);
            } else if (state.mode === 'angle') {
                if (state.tempPoints.length === 1) {
                    const p1 = worldToScreen(state.tempPoints[0].x, state.tempPoints[0].y);
                    const p2 = worldToScreen(snappedWorld.x, snappedWorld.y);
                    drawDimensionLineScreen(p1, p2, '꼭짓점 클릭', '#c084fc', true);
                } else if (state.tempPoints.length === 2) {
                    const p1 = worldToScreen(state.tempPoints[0].x, state.tempPoints[0].y);
                    const v = worldToScreen(state.tempPoints[1].x, state.tempPoints[1].y);
                    const p3 = worldToScreen(snappedWorld.x, snappedWorld.y);
                    const deg = calculateAngleDeg(state.tempPoints[0], state.tempPoints[1], snappedWorld);
                    drawAngleScreen(p1, v, p3, `${deg.toFixed(1)}°`, '#c084fc');
                    document.getElementById('live-dist').textContent = `${deg.toFixed(1)}°`;
                    document.getElementById('live-angle').textContent = `${deg.toFixed(1)}°`;
                }
            }
        }
    }

    function drawGrid(w, h) {
        const step = 25 * state.zoom;
        if (step < 8) return;
        const isLight = document.documentElement.classList.contains('light-mode');
        ctx.strokeStyle = isLight ? 'rgba(71, 85, 105, 0.14)' : 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        const startX = ((state.panX % step) + step) % step;
        const startY = ((state.panY % step) + step) % step;

        for (let x = startX; x < w; x += step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
        for (let y = startY; y < h; y += step) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();
    }

    // CAD 스타일 치수선 그리기
    function drawDimensionLineScreen(p1, p2, text, color, isDashed) {
        ctx.save();
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        const tickSize = 8;
        const nx = -Math.sin(angle) * tickSize;
        const ny = Math.cos(angle) * tickSize;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p1.x - nx, p1.y - ny);
        ctx.lineTo(p1.x + nx, p1.y + ny);
        ctx.moveTo(p2.x - nx, p2.y - ny);
        ctx.lineTo(p2.x + nx, p2.y + ny);
        ctx.stroke();

        if (isDashed) ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);

        [p1, p2].forEach(pt => {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        if (len > 5 && text) {
            drawPillBadge((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - 13, text, color);
        }
        ctx.restore();
    }

    // 사각형 면적(㎡·평) 렌더링
    function drawAreaRectScreen(p1, p2, mainLabel, widthLabel, heightLabel, color, isDashed = false) {
        ctx.save();
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        const w = Math.abs(p2.x - p1.x);
        const h = Math.abs(p2.y - p1.y);

        ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        if (isDashed) ctx.setLineDash([6, 4]);
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);

        [p1, p2].forEach(pt => {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        if (w > 20 && h > 20) {
            drawPillBadge(x + w / 2, y + h / 2, mainLabel, color);
            drawPillBadge(x + w / 2, y - 12, `가로 ${widthLabel}`, '#34d399');
            drawPillBadge(x + w + 42, y + h / 2, `세로 ${heightLabel}`, '#34d399');
        }
        ctx.restore();
    }

    // 연속 구간(Polyline) 렌더링
    function drawPolylineScreen(pts, label, color, isDashed = false) {
        if (pts.length < 2) return;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        if (isDashed) ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        pts.forEach(pt => {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        const last = pts[pts.length - 1];
        drawPillBadge(last.x, last.y - 16, label, color);
        ctx.restore();
    }

    function drawPillBadge(cx, cy, text, borderColor) {
        ctx.save();
        ctx.font = 'bold 11px "JetBrains Mono", "Noto Sans KR", monospace';
        const textWidth = ctx.measureText(text).width;
        const boxW = textWidth + 16;
        const boxH = 22;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, cx, cy);
        ctx.restore();
    }

    function calculateAngleDeg(p1, vertex, p3) {
        const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
        const a2 = Math.atan2(p3.y - vertex.y, p3.x - vertex.x);
        let diff = Math.abs(a1 - a2) * (180 / Math.PI);
        if (diff > 180) diff = 360 - diff;
        return diff;
    }

    function drawAngleScreen(p1, vertex, p3, label, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(vertex.x, vertex.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.moveTo(vertex.x, vertex.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.stroke();

        const r = 28;
        const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
        const a2 = Math.atan2(p3.y - vertex.y, p3.x - vertex.x);
        ctx.fillStyle = 'rgba(192, 132, 252, 0.18)';
        ctx.beginPath();
        ctx.moveTo(vertex.x, vertex.y);
        ctx.arc(vertex.x, vertex.y, r, a1, a2, false);
        ctx.closePath();
        ctx.fill();

        [p1, vertex, p3].forEach(pt => {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.stroke();
        });

        drawPillBadge(vertex.x, vertex.y - 24, label, color);
        ctx.restore();
    }

    // 실시간 우측 사이드바 수치 갱신
    function updateLiveReadout(ptA, ptB, modeType = 'distance', overrideTotalPx = null) {
        const dxPx = Math.abs(ptB.x - ptA.x);
        const dyPx = Math.abs(ptB.y - ptA.y);
        const distPx = overrideTotalPx !== null ? overrideTotalPx : Math.hypot(dxPx, dyPx);
        const angleDeg = Math.atan2(-(ptB.y - ptA.y), ptB.x - ptA.x) * (180 / Math.PI);

        if (modeType === 'area') {
            const areaInfo = formatArea(dxPx, dyPx);
            document.getElementById('live-dist').textContent = areaInfo.main;
            document.getElementById('live-dx').textContent = formatWorldDistance(dxPx);
            document.getElementById('live-dy').textContent = formatWorldDistance(dyPx);
            document.getElementById('live-px').textContent = `${Math.round(dxPx)}×${Math.round(dyPx)} px`;
            document.getElementById('live-angle').textContent = areaInfo.pyeong;
        } else {
            document.getElementById('live-dist').textContent = formatWorldDistance(distPx);
            document.getElementById('live-dx').textContent = formatWorldDistance(dxPx);
            document.getElementById('live-dy').textContent = formatWorldDistance(dyPx);
            document.getElementById('live-px').textContent = `${distPx.toFixed(1)} px`;
            document.getElementById('live-angle').textContent = `${angleDeg.toFixed(1)}°`;
        }
    }

    // --- 정밀 돋보기 (Loupe) 렌더링 ---
    function renderLoupe() {
        const size = 128;
        const zoomFactor = state.loupeZoom;
        loupeCtx.clearRect(0, 0, size, size);

        const dpr = window.devicePixelRatio || 1;
        const srcSize = (size / zoomFactor) * dpr;
        const sx = state.mouseScreen.x * dpr - srcSize / 2;
        const sy = state.mouseScreen.y * dpr - srcSize / 2;

        loupeCtx.imageSmoothingEnabled = false;
        loupeCtx.drawImage(
            mainCanvas,
            sx, sy, srcSize, srcSize,
            0, 0, size, size
        );

        loupeCoord.textContent = `${Math.round(state.mouseWorld.x)}, ${Math.round(state.mouseWorld.y)}`;
    }

    btnLoupeZoom.addEventListener('click', () => {
        state.loupeZoom = state.loupeZoom === 4 ? 8 : 4;
        btnLoupeZoom.textContent = `🔍 ${state.loupeZoom}x`;
        renderLoupe();
    });

    // --- 포인터 / 마우스 / 터치 통합 이벤트 처리 ---
    function getCanvasPos(clientX, clientY) {
        const rect = mainCanvas.getBoundingClientRect();
        return {
            sx: clientX - rect.left,
            sy: clientY - rect.top
        };
    }

    mainCanvas.addEventListener('pointerdown', (e) => {
        const { sx, sy } = getCanvasPos(e.clientX, e.clientY);
        state.mouseScreen = { x: sx, y: sy };
        state.mouseWorld = screenToWorld(sx, sy);

        // 1. 마우스 휠 클릭 또는 스페이스바+클릭 또는 Pan 모드일 때 화면 이동
        if (e.button === 1 || state.isSpaceDown || state.mode === 'pan') {
            e.preventDefault();
            state.isPanning = true;
            state.panStartMouse = { x: e.clientX, y: e.clientY };
            state.panStartOffset = { x: state.panX, y: state.panY };
            viewport.style.cursor = 'grabbing';
            return;
        }

        // 2. 우클릭 시: 연속거리(poly) 모드면 완료, 아니면 취소
        if (e.button === 2) {
            if (state.mode === 'poly' && state.tempPoints.length >= 2) {
                finishPolyline();
            } else {
                state.tempPoints = [];
                calibPopup.classList.add('hidden');
                renderMainCanvas();
            }
            return;
        }

        if (e.button !== 0) return;

        // 3. 임시 찍는 점이 없을 때 기존 끝점 마커를 클릭했으면 드래그 수정 시작
        if (state.tempPoints.length === 0) {
            const hit = findHandleAtScreenPos(sx, sy);
            if (hit) {
                state.draggingHandle = hit;
                viewport.style.cursor = 'move';
                return;
            }
        }

        let worldPt = screenToWorld(sx, sy);
        if (state.tempPoints.length > 0 && state.mode !== 'area') {
            worldPt = applyOrthoSnap(state.tempPoints[state.tempPoints.length - 1], worldPt);
        }

        // 4. 모드별 점 추가
        if (state.mode === 'calibrate') {
            state.tempPoints.push(worldPt);
            if (state.tempPoints.length === 2) {
                const p1 = state.tempPoints[0];
                const p2 = state.tempPoints[1];
                const distPx = Math.hypot(p2.x - p1.x, p2.y - p1.y);
                if (distPx < 1) {
                    showToast('두 지점이 너무 가깝습니다. 다시 클릭해 주세요.');
                    state.tempPoints = [];
                    return;
                }
                state.calibLine = { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
                state.refPx = distPx;
                state.tempPoints = [];
                openCalibrationPopup(sx, sy, distPx);
            }
        } else if (state.mode === 'measure') {
            state.tempPoints.push(worldPt);
            if (state.tempPoints.length === 2) {
                const p1 = state.tempPoints[0];
                const p2 = state.tempPoints[1];
                const distPx = Math.hypot(p2.x - p1.x, p2.y - p1.y);
                if (distPx >= 1) {
                    state.measurements.push({
                        id: state.nextId++,
                        type: 'distance',
                        points: [p1, p2],
                        name: ''
                    });
                    updateLiveReadout(p1, p2, 'distance');
                    renderMeasurementList();
                }
                state.tempPoints = [];
            }
        } else if (state.mode === 'area') {
            state.tempPoints.push(worldPt);
            if (state.tempPoints.length === 2) {
                const p1 = state.tempPoints[0];
                const p2 = state.tempPoints[1];
                if (Math.abs(p2.x - p1.x) >= 2 && Math.abs(p2.y - p1.y) >= 2) {
                    state.measurements.push({
                        id: state.nextId++,
                        type: 'area',
                        points: [p1, p2],
                        name: ''
                    });
                    updateLiveReadout(p1, p2, 'area');
                    renderMeasurementList();
                }
                state.tempPoints = [];
            }
        } else if (state.mode === 'poly') {
            state.tempPoints.push(worldPt);
        } else if (state.mode === 'angle') {
            state.tempPoints.push(worldPt);
            if (state.tempPoints.length === 3) {
                state.measurements.push({
                    id: state.nextId++,
                    type: 'angle',
                    points: [...state.tempPoints],
                    name: ''
                });
                renderMeasurementList();
                state.tempPoints = [];
            }
        }

        renderMainCanvas();
        renderLoupe();
    });

    // 더블클릭으로 연속거리(poly) 완료
    mainCanvas.addEventListener('dblclick', () => {
        if (state.mode === 'poly' && state.tempPoints.length >= 2) {
            finishPolyline();
        }
    });

    function finishPolyline() {
        if (state.tempPoints.length >= 2) {
            state.measurements.push({
                id: state.nextId++,
                type: 'poly',
                points: [...state.tempPoints],
                name: ''
            });
            renderMeasurementList();
            showToast('연속 구간 거리 측정이 저장되었습니다.');
        }
        state.tempPoints = [];
        renderMainCanvas();
    }

    window.addEventListener('pointermove', (e) => {
        const { sx, sy } = getCanvasPos(e.clientX, e.clientY);
        state.mouseScreen = { x: sx, y: sy };
        state.mouseWorld = screenToWorld(sx, sy);

        document.getElementById('status-coords').textContent =
            `X: ${Math.round(state.mouseWorld.x)}, Y: ${Math.round(state.mouseWorld.y)}`;

        if (state.isPanning) {
            state.panX = state.panStartOffset.x + (e.clientX - state.panStartMouse.x);
            state.panY = state.panStartOffset.y + (e.clientY - state.panStartMouse.y);
            updateFloatingRuler();
            renderMainCanvas();
            renderLoupe();
            return;
        }

        // 끝점 마커 드래그 수정 중일 때
        if (state.draggingHandle) {
            const dh = state.draggingHandle;
            if (dh.target === 'measurement') {
                const m = state.measurements[dh.mIndex];
                if (m) {
                    m.points[dh.ptIndex] = { ...state.mouseWorld };
                    if (m.type === 'distance') updateLiveReadout(m.points[0], m.points[1], 'distance');
                    else if (m.type === 'area') updateLiveReadout(m.points[0], m.points[1], 'area');
                    renderMeasurementList();
                }
            } else if (dh.target === 'calib' && state.calibLine) {
                if (dh.ptIndex === 1) {
                    state.calibLine.x1 = state.mouseWorld.x;
                    state.calibLine.y1 = state.mouseWorld.y;
                } else {
                    state.calibLine.x2 = state.mouseWorld.x;
                    state.calibLine.y2 = state.mouseWorld.y;
                }
                const newPx = Math.hypot(state.calibLine.x2 - state.calibLine.x1, state.calibLine.y2 - state.calibLine.y1);
                if (newPx >= 1) {
                    state.refPx = newPx;
                    recalculateScale();
                }
            }
            renderMainCanvas();
            renderLoupe();
            return;
        }

        // 호버 중인 끝점 마커 감지
        if (state.tempPoints.length === 0 && !state.isSpaceDown && state.mode !== 'pan') {
            state.hoveredHandle = findHandleAtScreenPos(sx, sy);
            viewport.style.cursor = state.hoveredHandle ? 'move' : 'crosshair';
        }

        renderMainCanvas();
        renderLoupe();
    });

    window.addEventListener('pointerup', () => {
        if (state.isPanning) {
            state.isPanning = false;
            viewport.style.cursor = state.mode === 'pan' ? 'grab' : 'crosshair';
        }
        if (state.draggingHandle) {
            state.draggingHandle = null;
            viewport.style.cursor = 'crosshair';
        }
    });

    mainCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // 마우스 휠 확대/축소
    mainCanvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        applyZoomAt(zoomFactor, state.mouseScreen.x, state.mouseScreen.y);
    }, { passive: false });

    function applyZoomAt(factor, centerX, centerY) {
        const newZoom = Math.max(0.15, Math.min(25, state.zoom * factor));
        const worldBefore = screenToWorld(centerX, centerY);
        state.zoom = newZoom;
        state.panX = centerX - worldBefore.x * state.zoom;
        state.panY = centerY - worldBefore.y * state.zoom;

        document.getElementById('btn-zoom-reset').textContent = `${Math.round(state.zoom * 100)}%`;
        updateFloatingRuler();
        renderMainCanvas();
        renderLoupe();
    }

    document.getElementById('btn-zoom-in').addEventListener('click', () => {
        applyZoomAt(1.25, viewport.clientWidth / 2, viewport.clientHeight / 2);
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        applyZoomAt(0.8, viewport.clientWidth / 2, viewport.clientHeight / 2);
    });
    document.getElementById('btn-zoom-reset').addEventListener('click', () => {
        if (state.bgImage) {
            fitImageToViewport(state.bgImage);
        } else {
            state.zoom = 1.0;
            state.panX = 0;
            state.panY = 0;
            document.getElementById('btn-zoom-reset').textContent = '100%';
            updateFloatingRuler();
            renderMainCanvas();
        }
    });

    // --- 실행 취소 (Undo) ---
    function undoLastAction() {
        if (state.tempPoints.length > 0) {
            state.tempPoints.pop();
            renderMainCanvas();
            return;
        }
        if (state.measurements.length > 0) {
            state.measurements.pop();
            renderMeasurementList();
            renderMainCanvas();
            showToast('마지막 측정 항목이 취소되었습니다.');
        }
    }
    document.getElementById('btn-undo').addEventListener('click', undoLastAction);

    // --- 기준점 2점 클릭 팝업 처리 ---
    function openCalibrationPopup(screenX, screenY, distPx) {
        calibPopupPx.textContent = `${distPx.toFixed(1)} px`;
        selectCalibUnit.value = state.displayUnit === 'px' ? 'mm' : state.displayUnit;

        const popW = 320, popH = 225;
        const left = Math.max(12, Math.min(viewport.clientWidth - popW - 12, screenX + 16));
        const top = Math.max(12, Math.min(viewport.clientHeight - popH - 12, screenY + 16));

        calibPopup.style.left = `${left}px`;
        calibPopup.style.top = `${top}px`;
        calibPopup.classList.remove('hidden');

        inputCalibValue.value = state.refRealValue;
        setTimeout(() => {
            inputCalibValue.focus();
            inputCalibValue.select();
        }, 30);
    }

    function confirmCalibrationPopup() {
        const val = parseFloat(inputCalibValue.value);
        const unit = selectCalibUnit.value;
        if (!val || val <= 0) {
            showToast('0보다 큰 실제 수치를 입력해 주세요.');
            return;
        }
        state.refRealValue = val;
        state.refRealUnit = unit;
        state.displayUnit = unit;
        document.getElementById('select-unit').value = unit;

        calibPopup.classList.add('hidden');
        recalculateScale();
        setMode('measure');
        showToast(`배율 보정 완료! (${state.refPx.toFixed(1)}px = ${val}${unit}) 이제 자유롭게 측정하세요.`);
    }

    document.getElementById('btn-apply-calib-popup').addEventListener('click', confirmCalibrationPopup);
    inputCalibValue.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmCalibrationPopup();
        if (e.key === 'Escape') calibPopup.classList.add('hidden');
    });
    document.getElementById('btn-cancel-calib-popup').addEventListener('click', () => {
        calibPopup.classList.add('hidden');
    });
    document.querySelectorAll('.calib-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            inputCalibValue.value = btn.dataset.val;
            selectCalibUnit.value = btn.dataset.unit;
            confirmCalibrationPopup();
        });
    });

    // --- 신용카드 / 모니터 인치 1:1 실물 크기 보정 모달 ---
    const modalCardCalib = document.getElementById('modal-card-calib');
    const sliderCardPx = document.getElementById('slider-card-px');
    const cardPreviewBox = document.getElementById('card-preview-box');
    const cardPxLabel = document.getElementById('card-px-label');

    function updateCardPreview(pxWidth) {
        const ratio = 53.98 / 85.60;
        const pxHeight = Math.round(pxWidth * ratio);
        cardPreviewBox.style.width = `${pxWidth}px`;
        cardPreviewBox.style.height = `${pxHeight}px`;
        const dpi = (pxWidth / (85.60 / 25.4)).toFixed(1);
        cardPxLabel.textContent = `${pxWidth} px = 85.60 mm (${dpi} DPI)`;
    }

    function openCardCalibModal() {
        modalCardCalib.classList.remove('hidden');
        modalCardCalib.classList.add('flex');
        const currentCardPx = Math.max(180, Math.min(600, Math.round(85.60 / state.mmPerPixel)));
        sliderCardPx.value = currentCardPx;
        updateCardPreview(currentCardPx);
    }

    document.getElementById('btn-open-card-calib').addEventListener('click', openCardCalibModal);
    document.getElementById('btn-welcome-card').addEventListener('click', openCardCalibModal);
    document.getElementById('btn-close-card-modal').addEventListener('click', () => {
        modalCardCalib.classList.add('hidden');
        modalCardCalib.classList.remove('flex');
    });

    sliderCardPx.addEventListener('input', (e) => {
        updateCardPreview(parseInt(e.target.value, 10));
    });

    document.querySelectorAll('.monitor-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const ppi = parseFloat(btn.dataset.ppi);
            const cardPx = Math.round((85.60 / 25.4) * ppi);
            sliderCardPx.value = cardPx;
            updateCardPreview(cardPx);
        });
    });

    document.getElementById('btn-apply-card-calib').addEventListener('click', () => {
        const px = parseFloat(sliderCardPx.value);
        state.refPx = px;
        state.refRealValue = 85.6;
        state.refRealUnit = 'mm';
        state.displayUnit = 'mm';
        state.calibLine = null;
        document.getElementById('select-unit').value = 'mm';
        modalCardCalib.classList.add('hidden');
        modalCardCalib.classList.remove('flex');
        recalculateScale();
        showToast('모니터 1:1 실물 크기(신용카드 85.6mm 기준) 보정이 적용되었습니다!');
    });

    // --- 우측 측정 목록 렌더링 및 이름 수정/복사/삭제 ---
    function getMeasurementSummary(m, index) {
        const labelPrefix = m.name ? m.name : `#${index + 1}`;
        if (m.type === 'distance') {
            const dx = Math.abs(m.points[1].x - m.points[0].x);
            const dy = Math.abs(m.points[1].y - m.points[0].y);
            const distPx = Math.hypot(dx, dy);
            return {
                badge: labelPrefix,
                typeStr: '거리',
                title: formatWorldDistance(distPx),
                sub: `가로 ${formatWorldDistance(dx)} · 세로 ${formatWorldDistance(dy)} (${distPx.toFixed(1)}px)`,
                rawPx: distPx.toFixed(1)
            };
        } else if (m.type === 'area') {
            const dx = Math.abs(m.points[1].x - m.points[0].x);
            const dy = Math.abs(m.points[1].y - m.points[0].y);
            const areaInfo = formatArea(dx, dy);
            return {
                badge: labelPrefix,
                typeStr: '면적',
                title: areaInfo.main,
                sub: areaInfo.sub,
                rawPx: `${Math.round(dx)}x${Math.round(dy)}`
            };
        } else if (m.type === 'poly') {
            let totalPx = 0;
            for (let i = 1; i < m.points.length; i++) {
                totalPx += Math.hypot(m.points[i].x - m.points[i - 1].x, m.points[i].y - m.points[i - 1].y);
            }
            return {
                badge: labelPrefix,
                typeStr: '연속거리',
                title: `총 ${formatWorldDistance(totalPx)}`,
                sub: `${m.points.length - 1}개 구간 합계 (${totalPx.toFixed(1)}px)`,
                rawPx: totalPx.toFixed(1)
            };
        } else {
            const deg = calculateAngleDeg(m.points[0], m.points[1], m.points[2]);
            return {
                badge: labelPrefix,
                typeStr: '각도',
                title: `${deg.toFixed(1)}°`,
                sub: `3점 각도 측정`,
                rawPx: '-'
            };
        }
    }

    function renderMeasurementList() {
        const listEl = document.getElementById('measurement-list');
        const countEl = document.getElementById('measurement-count');
        countEl.textContent = state.measurements.length;

        if (state.measurements.length === 0) {
            listEl.innerHTML = `
                <div class="text-center text-slate-500 py-6 text-xs leading-relaxed">
                    아직 측정된 치수선이 없습니다.<br>
                    화면에서 지점을 클릭하면 치수 기록이 저장되며,<br>
                    <strong>이름을 클릭해 메모</strong>를 남길 수 있습니다.
                </div>`;
            return;
        }

        listEl.innerHTML = '';
        state.measurements.forEach((m, index) => {
            const info = getMeasurementSummary(m, index);
            const card = document.createElement('div');
            card.className = 'bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 flex items-center justify-between transition';

            card.innerHTML = `
                <div class="min-w-0 pr-2 flex-1">
                    <div class="flex items-center gap-1.5">
                        <button data-idx="${index}" class="btn-rename-item text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold cursor-pointer" title="클릭하여 이름(메모) 변경">
                            ✏️ ${info.badge}
                        </button>
                        <span class="font-mono-num font-bold text-xs sm:text-sm text-amber-300 truncate">${info.title}</span>
                    </div>
                    <div class="text-[10px] font-mono-num text-slate-400 mt-1 truncate">${info.sub}</div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button data-copy="${info.badge}: ${info.title}" class="btn-copy-item p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer" title="수치 복사">
                        📋
                    </button>
                    <button data-idx="${index}" class="btn-del-item p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer" title="삭제">
                        ✕
                    </button>
                </div>
            `;
            listEl.appendChild(card);
        });

        listEl.querySelectorAll('.btn-rename-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx, 10);
                const currentName = state.measurements[idx].name || `#${idx + 1}`;
                const newName = prompt('이 측정 항목의 이름(예: 안방 가로, 책상 길이)을 입력하세요:', currentName);
                if (newName !== null) {
                    state.measurements[idx].name = newName.trim();
                    renderMeasurementList();
                    renderMainCanvas();
                }
            });
        });

        listEl.querySelectorAll('.btn-copy-item').forEach(btn => {
            btn.addEventListener('click', () => {
                navigator.clipboard?.writeText(btn.dataset.copy);
                showToast(`복사됨: ${btn.dataset.copy}`);
            });
        });

        listEl.querySelectorAll('.btn-del-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx, 10);
                state.measurements.splice(idx, 1);
                renderMeasurementList();
                renderMainCanvas();
            });
        });
    }

    document.getElementById('btn-clear-measurements').addEventListener('click', () => {
        if (state.measurements.length === 0) return;
        state.measurements = [];
        renderMeasurementList();
        renderMainCanvas();
        showToast('모든 측정 기록이 비워졌습니다.');
    });

    // 전체 텍스트 복사 및 엑셀(CSV) 내보내기
    document.getElementById('btn-copy-all').addEventListener('click', () => {
        if (state.measurements.length === 0) {
            showToast('복사할 측정 기록이 없습니다.');
            return;
        }
        const lines = state.measurements.map((m, i) => {
            const info = getMeasurementSummary(m, i);
            return `${info.badge} [${info.typeStr}] : ${info.title} (${info.sub})`;
        });
        navigator.clipboard?.writeText(lines.join('\n'));
        showToast('전체 측정 목록이 클립보드에 복사되었습니다!');
    });

    document.getElementById('btn-export-csv').addEventListener('click', () => {
        if (state.measurements.length === 0) {
            showToast('저장할 측정 기록이 없습니다.');
            return;
        }
        const rows = [['번호', '이름', '측정유형', '측정결과', '상세내역', '원본픽셀']];
        state.measurements.forEach((m, i) => {
            const info = getMeasurementSummary(m, i);
            rows.push([
                i + 1,
                `"${(m.name || `#${i + 1}`).replace(/"/g, '""')}"`,
                info.typeStr,
                `"${info.title}"`,
                `"${info.sub}"`,
                info.rawPx
            ]);
        });
        const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `scaleruler-measurements-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        showToast('엑셀(CSV) 파일이 다운로드되었습니다.');
    });

    // --- 치수 포함 이미지 저장 (PNG Export) ---
    document.getElementById('btn-export-png').addEventListener('click', () => {
        const exportCanvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        exportCanvas.width = mainCanvas.width;
        exportCanvas.height = mainCanvas.height;
        const eCtx = exportCanvas.getContext('2d');

        // 배경색 채우기
        const isLight = document.documentElement.classList.contains('light-mode');
        eCtx.fillStyle = isLight ? '#f8fafc' : '#020617';
        eCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        // 현재 메인 캔버스 복사
        eCtx.drawImage(mainCanvas, 0, 0);

        // 좌측 하단 배율 정보 워터마크 스탬프
        eCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const stampText = `ScaleRuler Pro · ${document.getElementById('badge-scale-status').textContent}`;
        eCtx.font = 'bold 11px "JetBrains Mono", "Noto Sans KR", sans-serif';
        const tw = eCtx.measureText(stampText).width + 20;
        const vh = viewport.clientHeight;
        eCtx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        eCtx.fillRect(12, vh - 36, tw, 24);
        eCtx.fillStyle = '#fbbf24';
        eCtx.fillText(stampText, 22, vh - 20);

        const link = document.createElement('a');
        link.href = exportCanvas.toDataURL('image/png');
        link.download = `scaleruler-result-${new Date().toISOString().slice(0, 10)}.png`;
        link.click();
        showToast('치수선이 포함된 이미지가 PNG로 저장되었습니다!');
    });

    // --- 배율 연동 반투명 플로팅 눈금자 (Floating Screen Ruler) ---
    function updateFloatingRuler() {
        if (!state.rulerVisible) {
            floatingRuler.classList.add('hidden');
            return;
        }
        floatingRuler.classList.remove('hidden');

        const isHoriz = state.rulerOrientation === 'horizontal';
        const w = isHoriz ? state.rulerLength : state.rulerBreadth;
        const h = isHoriz ? state.rulerBreadth : state.rulerLength;

        floatingRuler.style.left = `${state.rulerX}px`;
        floatingRuler.style.top = `${state.rulerY}px`;
        floatingRuler.style.width = `${w}px`;
        floatingRuler.style.height = `${h}px`;

        if (isHoriz) {
            rulerResizeGrip.style.right = '0';
            rulerResizeGrip.style.top = '0';
            rulerResizeGrip.style.bottom = '0';
            rulerResizeGrip.style.left = 'auto';
            rulerResizeGrip.style.width = '16px';
            rulerResizeGrip.style.height = '100%';
            rulerResizeGrip.style.cursor = 'ew-resize';
        } else {
            rulerResizeGrip.style.bottom = '0';
            rulerResizeGrip.style.left = '0';
            rulerResizeGrip.style.right = '0';
            rulerResizeGrip.style.top = 'auto';
            rulerResizeGrip.style.height = '16px';
            rulerResizeGrip.style.width = '100%';
            rulerResizeGrip.style.cursor = 'ns-resize';
        }

        const dpr = window.devicePixelRatio || 1;
        rulerCanvas.width = w * dpr;
        rulerCanvas.height = h * dpr;
        rulerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        rulerCtx.clearRect(0, 0, w, h);

        let screenPxPerUnit = state.zoom;
        if (state.displayUnit !== 'px') {
            const worldPxPerUnit = UNIT_TO_MM[state.displayUnit] / state.mmPerPixel;
            screenPxPerUnit = worldPxPerUnit * state.zoom;
        }

        const niceSteps = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
        let minorStep = 1;
        for (const s of niceSteps) {
            if (s * screenPxPerUnit >= 6) {
                minorStep = s;
                break;
            }
        }

        const maxUnits = state.rulerLength / screenPxPerUnit;
        const totalSteps = Math.min(3000, Math.floor(maxUnits / minorStep));

        rulerCtx.font = 'bold 10px "JetBrains Mono", monospace';
        rulerCtx.fillStyle = '#0f172a';
        rulerCtx.textBaseline = 'middle';

        for (let i = 0; i <= totalSteps; i++) {
            const unitVal = +(i * minorStep).toFixed(5);
            const pos = unitVal * screenPxPerUnit;
            if (pos > state.rulerLength - 4) break;

            const isMajor = i % 10 === 0;
            const isMid = !isMajor && i % 5 === 0;
            const tickLen = isMajor ? 20 : (isMid ? 13 : 7);

            rulerCtx.strokeStyle = isMajor ? '#0f172a' : 'rgba(15, 23, 42, 0.55)';
            rulerCtx.lineWidth = isMajor ? 1.5 : 1;

            rulerCtx.beginPath();
            if (isHoriz) {
                rulerCtx.moveTo(pos, 0);
                rulerCtx.lineTo(pos, tickLen);
                rulerCtx.moveTo(pos, h);
                rulerCtx.lineTo(pos, h - tickLen);
            } else {
                rulerCtx.moveTo(0, pos);
                rulerCtx.lineTo(tickLen, pos);
                rulerCtx.moveTo(w, pos);
                rulerCtx.lineTo(w - tickLen, pos);
            }
            rulerCtx.stroke();

            if (isMajor) {
                const label = Number.isInteger(unitVal) ? unitVal.toString() : unitVal.toFixed(2).replace(/\.?0+$/, '');
                if (isHoriz) {
                    rulerCtx.textAlign = i === 0 ? 'left' : 'center';
                    rulerCtx.fillText(label, i === 0 ? pos + 3 : pos, 28);
                } else {
                    rulerCtx.textAlign = 'left';
                    rulerCtx.fillText(label, 23, i === 0 ? pos + 8 : pos);
                }
            }
        }

        // 눈금자 위 P1 / P2 핀 그리기
        if (state.rulerPins.length > 0) {
            state.rulerPins.forEach((pinWorldPx, idx) => {
                const pinScreenPos = pinWorldPx * state.zoom;
                if (pinScreenPos <= state.rulerLength) {
                    rulerCtx.strokeStyle = idx === 0 ? '#2563eb' : '#dc2626';
                    rulerCtx.lineWidth = 2;
                    rulerCtx.beginPath();
                    if (isHoriz) {
                        rulerCtx.moveTo(pinScreenPos, 0);
                        rulerCtx.lineTo(pinScreenPos, h);
                    } else {
                        rulerCtx.moveTo(0, pinScreenPos);
                        rulerCtx.lineTo(w, pinScreenPos);
                    }
                    rulerCtx.stroke();
                }
            });
        }

        if (state.rulerPins.length === 2) {
            const deltaWorldPx = Math.abs(state.rulerPins[1] - state.rulerPins[0]);
            rulerScaleLabel.textContent = `📌 핀 거리(Δ): ${formatWorldDistance(deltaWorldPx)} (전체 ${formatWorldDistance(state.rulerLength / state.zoom)})`;
            btnRulerPinClear.classList.remove('hidden');
        } else {
            rulerScaleLabel.textContent = `배율 연동 눈금자 (${state.displayUnit}) · 전체 ${formatWorldDistance(state.rulerLength / state.zoom)}`;
            btnRulerPinClear.classList.toggle('hidden', state.rulerPins.length === 0);
        }
    }

    // 눈금자 이동 / 리사이즈 / 클릭 핀 고정
    let rulerAction = null;
    let rStartX = 0, rStartY = 0, rInitX = 0, rInitY = 0, rInitLen = 0;
    let rulerDragged = false;

    document.getElementById('ruler-drag-area').addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        rulerAction = 'move';
        rulerDragged = false;
        rStartX = e.clientX;
        rStartY = e.clientY;
        rInitX = state.rulerX;
        rInitY = state.rulerY;
    });

    rulerResizeGrip.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        rulerAction = 'resize';
        rStartX = e.clientX;
        rStartY = e.clientY;
        rInitLen = state.rulerLength;
    });

    window.addEventListener('pointermove', (e) => {
        if (!rulerAction) return;
        const dx = e.clientX - rStartX;
        const dy = e.clientY - rStartY;
        if (Math.hypot(dx, dy) > 4) rulerDragged = true;

        if (rulerAction === 'move') {
            state.rulerX = rInitX + dx;
            state.rulerY = rInitY + dy;
        } else if (rulerAction === 'resize') {
            const delta = state.rulerOrientation === 'horizontal' ? dx : dy;
            state.rulerLength = Math.max(180, Math.min(2000, rInitLen + delta));
        }
        updateFloatingRuler();
    });

    window.addEventListener('pointerup', (e) => {
        if (rulerAction === 'move' && !rulerDragged) {
            // 드래그하지 않고 단순 클릭한 경우 눈금자 위에 P1/P2 핀 고정
            const rect = floatingRuler.getBoundingClientRect();
            const isHoriz = state.rulerOrientation === 'horizontal';
            const screenOffset = Math.max(0, Math.min(state.rulerLength, isHoriz ? (e.clientX - rect.left) : (e.clientY - rect.top)));
            const worldDistPx = screenOffset / state.zoom;
            if (state.rulerPins.length >= 2) state.rulerPins = [];
            state.rulerPins.push(worldDistPx);
            updateFloatingRuler();
        }
        rulerAction = null;
    });

    btnRulerPinClear.addEventListener('click', (e) => {
        e.stopPropagation();
        state.rulerPins = [];
        updateFloatingRuler();
    });

    document.getElementById('btn-ruler-opacity').addEventListener('click', (e) => {
        e.stopPropagation();
        state.rulerOpacityMode = (state.rulerOpacityMode + 1) % 3;
        const opacities = ['0.92', '0.55', '1.0'];
        floatingRuler.style.opacity = opacities[state.rulerOpacityMode];
    });

    floatingRuler.addEventListener('pointermove', (e) => {
        const rect = floatingRuler.getBoundingClientRect();
        const isHoriz = state.rulerOrientation === 'horizontal';
        const screenOffset = Math.max(0, Math.min(state.rulerLength, isHoriz ? (e.clientX - rect.left) : (e.clientY - rect.top)));
        const worldDistPx = screenOffset / state.zoom;

        rulerLaser.classList.remove('hidden');
        rulerLaserBadge.textContent = formatWorldDistance(worldDistPx);

        if (isHoriz) {
            rulerLaser.style.left = `${screenOffset}px`;
            rulerLaser.style.top = '0';
            rulerLaser.style.width = '1.5px';
            rulerLaser.style.height = '100%';
            rulerLaserBadge.style.top = '-26px';
            rulerLaserBadge.style.left = '-24px';
        } else {
            rulerLaser.style.top = `${screenOffset}px`;
            rulerLaser.style.left = '0';
            rulerLaser.style.height = '1.5px';
            rulerLaser.style.width = '100%';
            rulerLaserBadge.style.left = `${state.rulerBreadth + 6}px`;
            rulerLaserBadge.style.top = '-10px';
        }
    });

    floatingRuler.addEventListener('pointerleave', () => {
        rulerLaser.classList.add('hidden');
    });

    const btnToggleRuler = document.getElementById('btn-toggle-ruler');
    btnToggleRuler.addEventListener('click', () => {
        state.rulerVisible = !state.rulerVisible;
        btnToggleRuler.classList.toggle('bg-emerald-600', state.rulerVisible);
        btnToggleRuler.classList.toggle('bg-slate-700', !state.rulerVisible);
        updateFloatingRuler();
    });

    document.getElementById('btn-rotate-ruler').addEventListener('click', () => {
        state.rulerOrientation = state.rulerOrientation === 'horizontal' ? 'vertical' : 'horizontal';
        updateFloatingRuler();
    });

    // --- 직접 배율 입력 모달 ---
    const modalDirect = document.getElementById('modal-direct-scale');
    document.getElementById('btn-direct-scale').addEventListener('click', () => {
        document.getElementById('modal-input-px').value = state.refPx.toFixed(1);
        document.getElementById('modal-input-real').value = state.refRealValue;
        document.getElementById('modal-select-unit').value = state.refRealUnit;
        modalDirect.classList.remove('hidden');
        modalDirect.classList.add('flex');
    });

    document.getElementById('btn-close-direct-modal').addEventListener('click', () => {
        modalDirect.classList.add('hidden');
        modalDirect.classList.remove('flex');
    });

    document.getElementById('btn-save-direct-modal').addEventListener('click', () => {
        const px = parseFloat(document.getElementById('modal-input-px').value);
        const real = parseFloat(document.getElementById('modal-input-real').value);
        const unit = document.getElementById('modal-select-unit').value;
        if (px > 0 && real > 0) {
            state.refPx = px;
            state.refRealValue = real;
            state.refRealUnit = unit;
            state.displayUnit = unit;
            document.getElementById('select-unit').value = unit;
            modalDirect.classList.add('hidden');
            modalDirect.classList.remove('flex');
            recalculateScale();
            showToast(`직접 배율 설정 완료 (${px}px = ${real}${unit})`);
        }
    });

    // --- 이미지 불러오기 & 샘플 평면도 생성기 ---
    function fitImageToViewport(img) {
        const vw = viewport.clientWidth;
        const vh = viewport.clientHeight;
        const fitScale = Math.min(1, (vw - 80) / img.width, (vh - 80) / img.height);
        state.zoom = fitScale;
        state.panX = (vw - img.width * fitScale) / 2;
        state.panY = (vh - img.height * fitScale) / 2;
        document.getElementById('btn-zoom-reset').textContent = `${Math.round(state.zoom * 100)}%`;
        updateFloatingRuler();
        renderMainCanvas();
    }

    function loadImageFromSrc(src, isSample = false) {
        const img = new Image();
        img.onload = () => {
            state.bgImage = img;
            document.getElementById('welcome-overlay').classList.add('hidden');
            const bgOpacityCtrl = document.getElementById('bg-opacity-control');
            bgOpacityCtrl.classList.remove('hidden');
            bgOpacityCtrl.classList.add('flex');

            fitImageToViewport(img);

            if (!isSample) {
                showToast('사진이 로드되었습니다! (서버로 전송되지 않고 내 브라우저에서만 안전하게 열렸습니다)');
            }
        };
        img.src = src;
    }

    document.getElementById('slider-bg-opacity').addEventListener('input', (e) => {
        state.bgOpacity = parseInt(e.target.value, 10) / 100;
        renderMainCanvas();
    });

    document.getElementById('btn-clear-bg').addEventListener('click', () => {
        state.bgImage = null;
        document.getElementById('bg-opacity-control').classList.add('hidden');
        document.getElementById('bg-opacity-control').classList.remove('flex');
        renderMainCanvas();
        showToast('배경 이미지가 제거되었습니다.');
    });

    document.getElementById('btn-close-welcome').addEventListener('click', () => {
        document.getElementById('welcome-overlay').classList.add('hidden');
    });

    // 샘플 아파트 평면도 생성 및 즉시 체험
    function loadSampleFloorplan() {
        const c = document.createElement('canvas');
        c.width = 920;
        c.height = 620;
        const g = c.getContext('2d');

        // 도면 배경
        g.fillStyle = '#0f172a';
        g.fillRect(0, 0, c.width, c.height);

        // 도면 용지 테두리
        g.strokeStyle = '#334155';
        g.lineWidth = 2;
        g.strokeRect(24, 24, c.width - 48, c.height - 48);

        // 외벽 및 내벽 (기준: 100px = 1000mm -> 1px = 10mm)
        // 거실 (420px x 360px = 4200mm x 3600mm)
        // 안방 (360px x 360px = 3600mm x 3600mm)
        g.fillStyle = '#1e293b';
        g.fillRect(80, 110, 780, 420);

        g.strokeStyle = '#e2e8f0';
        g.lineWidth = 6;
        g.strokeRect(80, 110, 780, 420);

        // 중앙 내벽 분리선 (거실 420px | 안방 360px)
        g.beginPath();
        g.moveTo(500, 110);
        g.lineTo(500, 530);
        g.moveTo(80, 350);
        g.lineTo(500, 350);
        g.stroke();

        // 방 이름 및 가이드 텍스트
        g.fillStyle = '#94a3b8';
        g.font = 'bold 20px "Noto Sans KR", sans-serif';
        g.textAlign = 'center';
        g.fillText('거실 (Living Room)', 290, 225);
        g.font = '14px "JetBrains Mono", monospace';
        g.fillStyle = '#64748b';
        g.fillText('설계 치수: 4200 × 2400 mm', 290, 252);

        g.fillStyle = '#94a3b8';
        g.font = 'bold 20px "Noto Sans KR", sans-serif';
        g.fillText('안방 (Master Bedroom)', 680, 305);
        g.font = '14px "JetBrains Mono", monospace';
        g.fillStyle = '#64748b';
        g.fillText('설계 치수: 3600 × 4200 mm', 680, 332);

        g.fillStyle = '#94a3b8';
        g.font = 'bold 18px "Noto Sans KR", sans-serif';
        g.fillText('주방 / 다이닝 (Kitchen)', 290, 435);
        g.font = '13px "JetBrains Mono", monospace';
        g.fillStyle = '#64748b';
        g.fillText('설계 치수: 4200 × 1800 mm', 290, 460);

        // 상단 도면 표기 치수선 예시 (80, 75) ~ (500, 75) -> 420px = 4200mm
        g.strokeStyle = '#fbbf24';
        g.lineWidth = 1.5;
        g.beginPath();
        g.moveTo(80, 65);
        g.lineTo(80, 95);
        g.moveTo(500, 65);
        g.lineTo(500, 95);
        g.moveTo(80, 80);
        g.lineTo(500, 80);
        g.stroke();

        g.fillStyle = '#fbbf24';
        g.font = 'bold 14px "JetBrains Mono", sans-serif';
        g.fillText('◀ 도면 표기 기준 치수: 4200 mm ▶', 290, 62);

        // 우측 하단 타이틀 블록
        g.fillStyle = '#475569';
        g.font = '12px "JetBrains Mono", sans-serif';
        g.textAlign = 'right';
        g.fillText('SAMPLE CAD PLAN · SCALE 1 px = 10 mm', c.width - 40, c.height - 38);

        loadImageFromSrc(c.toDataURL('image/png'), true);

        // 샘플 기준선과 예시 측정값 자동 세팅
        state.calibLine = { x1: 80, y1: 80, x2: 500, y2: 80 };
        state.refPx = 420;
        state.refRealValue = 4200;
        state.refRealUnit = 'mm';
        state.displayUnit = 'mm';
        document.getElementById('select-unit').value = 'mm';

        state.measurements = [
            {
                id: state.nextId++,
                type: 'distance',
                points: [{ x: 500, y: 110 }, { x: 860, y: 110 }],
                name: '안방 가로폭'
            },
            {
                id: state.nextId++,
                type: 'area',
                points: [{ x: 500, y: 110 }, { x: 860, y: 530 }],
                name: '안방 면적'
            }
        ];

        recalculateScale();
        setMode('measure');
        showToast('샘플 평면도가 로드되었습니다! (기준 4200mm 보정 완료 · 직접 다른 곳도 클릭해 보세요)');
    }

    document.getElementById('btn-load-sample').addEventListener('click', loadSampleFloorplan);
    document.getElementById('btn-welcome-sample').addEventListener('click', loadSampleFloorplan);

    document.getElementById('input-image').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => loadImageFromSrc(ev.target.result);
        reader.readAsDataURL(file);
    });

    window.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
        if (!items) return;
        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                const file = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (ev) => loadImageFromSrc(ev.target.result);
                reader.readAsDataURL(file);
                break;
            }
        }
    });

    viewport.addEventListener('dragover', (e) => e.preventDefault());
    viewport.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => loadImageFromSrc(ev.target.result);
            reader.readAsDataURL(file);
        }
    });

    // --- 테마 전환 및 모바일 사이드바 토글 ---
    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-mode');
        try { localStorage.setItem('sr_theme', isLight ? 'light' : 'dark'); } catch (e) {}
        renderMainCanvas();
    });

    document.getElementById('btn-toggle-sidebar-mobile').addEventListener('click', () => {
        document.getElementById('right-sidebar').scrollIntoView({ behavior: 'smooth' });
    });

    // --- 키보드 단축키 ---
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            undoLastAction();
            return;
        }

        if (e.key === 'Shift') {
            state.isShiftDown = true;
            renderMainCanvas();
        } else if (e.code === 'Space') {
            state.isSpaceDown = true;
            viewport.style.cursor = 'grab';
        } else if (e.key === 'Enter' && state.mode === 'poly' && state.tempPoints.length >= 2) {
            finishPolyline();
        } else if (e.key === 'Escape') {
            state.tempPoints = [];
            calibPopup.classList.add('hidden');
            renderMainCanvas();
        } else if (e.key.toLowerCase() === 'c') {
            setMode('calibrate');
        } else if (e.key.toLowerCase() === 'm') {
            setMode('measure');
        } else if (e.key.toLowerCase() === 's') {
            setMode('area');
        } else if (e.key.toLowerCase() === 'p') {
            setMode('poly');
        } else if (e.key.toLowerCase() === 'a') {
            setMode('angle');
        } else if (e.key.toLowerCase() === 'r') {
            state.rulerOrientation = state.rulerOrientation === 'horizontal' ? 'vertical' : 'horizontal';
            updateFloatingRuler();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') {
            state.isShiftDown = false;
            renderMainCanvas();
        } else if (e.code === 'Space') {
            state.isSpaceDown = false;
            if (!state.isPanning) {
                viewport.style.cursor = state.mode === 'pan' ? 'grab' : 'crosshair';
            }
        }
    });

    window.addEventListener('resize', resizeMainCanvas);

    // --- 정보 모달 (보안 안내 / 쿠키 정책 / 수익화 가이드) ---
    const modalInfo = document.getElementById('modal-info');
    const modalInfoTitle = document.getElementById('modal-info-title');
    const modalInfoBody = document.getElementById('modal-info-body');

    function openInfoModal(title, htmlContent) {
        modalInfoTitle.textContent = title;
        modalInfoBody.innerHTML = htmlContent;
        modalInfo.classList.remove('hidden');
        modalInfo.classList.add('flex');
    }

    function closeInfoModal() {
        modalInfo.classList.add('hidden');
        modalInfo.classList.remove('flex');
    }

    document.getElementById('btn-close-info-modal').addEventListener('click', closeInfoModal);
    document.getElementById('btn-ok-info-modal').addEventListener('click', closeInfoModal);

    // 1. 사진 비저장 보안 원리 안내 모달
    const securityHtml = `
        <div class="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 text-emerald-200 space-y-2">
            <div class="font-extrabold text-sm">🔒 결론부터 말씀드리면: 업로드하신 사진은 서버에 절대 전송되거나 저장되지 않습니다!</div>
            <p>이 웹사이트에 올리신 도면, 사진, 캡처 화면은 인터넷을 통해 어디로도 전송되지 않으며, <strong>오직 현재 보고 계신 사용자의 컴퓨터·스마트폰 브라우저 메모리(RAM) 안에서만</strong> 열립니다.</p>
        </div>
        <h4 class="font-bold text-white text-xs pt-2">1. 기술적 동작 원리 (100% Client-Side Processing)</h4>
        <ul class="list-disc list-inside space-y-1.5 text-slate-300">
            <li>일반적인 파일 업로드 사이트는 파일을 서버(<code class="text-amber-300">POST /upload</code>)로 전송하지만, ScaleRuler Pro에는 <strong>서버 전송 코드 자체가 존재하지 않습니다.</strong></li>
            <li>웹 브라우저 내장 <code class="text-amber-300">FileReader.readAsDataURL()</code> 및 <code class="text-amber-300">HTML5 Canvas</code> API만을 사용해 내 컴퓨터 안에서 즉시 이미지를 화면에 그립니다.</li>
            <li>심지어 인터넷 랜선(와이파이)을 뽑은 오프라인 상태에서도 사진 불러오기와 치수 측정이 완벽하게 작동합니다.</li>
        </ul>
        <h4 class="font-bold text-white text-xs pt-2">2. 창을 닫으면 사진은 어떻게 되나요?</h4>
        <p>브라우저 탭을 닫거나 새로고침(<kbd class="px-1.5 py-0.5 bg-slate-800 rounded">F5</kbd>)하는 즉시 브라우저 메모리(RAM)에서 사진 데이터가 완전히 소멸됩니다. 사이트 운영자나 제3자는 사용자가 어떤 사진을 열었는지 절대 알 수 없으므로, <strong>회사 기밀 설계 도면, 부동산 계약 평면도, 개인 신분증/사진</strong>도 100% 안심하고 측정하실 수 있습니다.</p>
    `;

    document.getElementById('btn-privacy-badge').addEventListener('click', () => {
        openInfoModal('🛡️ 업로드 사진 처리 방식 및 개인정보 보안 안내', securityHtml);
    });
    document.getElementById('btn-footer-security').addEventListener('click', () => {
        openInfoModal('🛡️ 업로드 사진 처리 방식 및 개인정보 보안 안내', securityHtml);
    });

    // 2. 쿠키 및 광고 정책 모달
    const cookiePolicyHtml = `
        <p><strong>ScaleRuler Pro</strong>는 이용자의 편의를 위해 최소한의 브라우저 저장소(<code class="text-amber-300">localStorage</code>) 및 제3자 광고 쿠키를 사용합니다.</p>
        <h4 class="font-bold text-white text-xs pt-2">1. 필수 기능 저장 항목</h4>
        <ul class="list-disc list-inside space-y-1">
            <li>마지막으로 보정한 배율 수치(px 대 실제 단위 비율) 및 선택한 화면 테마(다크/라이트 모드)</li>
            <li>쿠키 안내 배너 확인 여부</li>
        </ul>
        <h4 class="font-bold text-white text-xs pt-2">2. Google AdSense 및 제3자 광고 쿠키 안내</h4>
        <ul class="list-disc list-inside space-y-1">
            <li>본 사이트는 무료 서비스 유지를 위해 Google AdSense 또는 카카오 애드핏 등 제3자 광고 서비스를 게재할 수 있습니다.</li>
            <li>Google을 포함한 제3자 광고 사업자는 쿠키를 사용하여 이용자의 이전 웹사이트 방문 기록을 바탕으로 맞춤형 광고를 제공할 수 있습니다.</li>
            <li>이용자는 언제든지 <a href="https://adssettings.google.com" target="_blank" rel="noopener" class="underline text-amber-300">Google 광고 설정</a> 페이지에서 맞춤형 광고를 해제하거나 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다.</li>
        </ul>
        <div class="pt-2">
            <a href="privacy.html" class="text-amber-300 underline font-bold">👉 전체 개인정보 처리방침 전문 페이지 보기</a>
        </div>
    `;
    document.getElementById('btn-footer-cookie').addEventListener('click', () => {
        openInfoModal('🍪 쿠키 및 맞춤형 광고 정책 안내', cookiePolicyHtml);
    });

    // 3. 광고로 돈 버는 법 (수익화 설정 가이드 모달)
    const monetizeGuideHtml = `
        <div class="bg-amber-500/15 border border-amber-400/40 rounded-xl p-4 text-amber-200 space-y-1.5">
            <div class="font-extrabold text-sm">💰 이 웹사이트로 광고 수익을 창출하는 2가지 방법</div>
            <p>이 사이트는 이미 <strong>우측 사이드바 광고 슬롯</strong>과 <strong>하단 반응형 배너 슬롯</strong>, 그리고 광고 심사에 필수적인 <strong>개인정보 처리방침·이용약관·풍부한 텍스트 가이드·ads.txt</strong>가 모두 준비되어 있습니다!</p>
        </div>

        <h4 class="font-bold text-white text-xs pt-2">방법 1. 카카오 애드핏 (Kakao AdFit) — 가장 빠른 승인 (추천!)</h4>
        <ol class="list-decimal list-inside space-y-1.5 text-slate-300">
            <li><a href="https://adfit.kakao.com" target="_blank" rel="noopener" class="underline text-amber-300">카카오 애드핏(adfit.kakao.com)</a>에 가입 후 현재 배포된 웹사이트 주소(<code class="text-sky-300">https://backheyoung.github.io/scale-ruler/</code>)를 등록합니다.</li>
            <li>광고 단위(예: <code class="text-amber-300">300x250</code> 또는 <code class="text-amber-300">320x100</code>, <code class="text-amber-300">728x90</code>)를 생성하면 <code class="text-amber-300">DAN-xxxxxxxx</code> 형태의 단위 ID가 발급됩니다.</li>
            <li><code class="text-amber-300">app.js</code> 파일 맨 위의 <code class="text-amber-300">AD_CONFIG</code>에서 <code class="text-emerald-300">enabled: true, provider: 'adfit'</code>으로 바꾸고 발급받은 ID를 넣으면 즉시 광고 수익이 쌓입니다!</li>
        </ol>

        <h4 class="font-bold text-white text-xs pt-2">방법 2. 구글 애드센스 (Google AdSense) — 가장 높은 단가</h4>
        <ol class="list-decimal list-inside space-y-1.5 text-slate-300">
            <li><a href="https://www.google.com/adsense" target="_blank" rel="noopener" class="underline text-amber-300">Google AdSense</a>에서 사이트 주소를 등록하고 발급받은 <code class="text-amber-300">ca-pub-XXXXXXXXXXXXXXXX</code> 번호를 <code class="text-amber-300">index.html</code> 상단 주석과 <code class="text-amber-300">ads.txt</code> 파일에 넣습니다.</li>
            <li>심사 승인 후 <code class="text-amber-300">app.js</code> 상단 <code class="text-amber-300">AD_CONFIG</code>에 슬롯 번호를 입력하고 <code class="text-emerald-300">enabled: true</code>로 변경하면 광고가 자동 노출됩니다.</li>
            <li><em>팁: 구글 애드센스는 개인 도메인(예: .com / .kr)을 연결하면 GitHub 기본 주소보다 승인 확률이 훨씬 높아집니다. 카카오 애드핏은 GitHub Pages 기본 주소로도 바로 승인받을 수 있습니다!</em></li>
        </ol>
    `;
    document.getElementById('btn-open-ad-guide').addEventListener('click', () => {
        openInfoModal('💰 웹사이트 광고 수익화 연동 가이드 (AdSense & AdFit)', monetizeGuideHtml);
    });
    document.getElementById('btn-footer-monetize').addEventListener('click', () => {
        openInfoModal('💰 웹사이트 광고 수익화 연동 가이드 (AdSense & AdFit)', monetizeGuideHtml);
    });

    // --- 실제 광고 스크립트 자동 렌더링 (AD_CONFIG.enabled === true 일 때) ---
    function initAdSlots() {
        if (!AD_CONFIG.enabled) return;
        const sidebarSlot = document.getElementById('ad-slot-sidebar');
        const bannerSlot = document.getElementById('ad-slot-banner');

        if (AD_CONFIG.provider === 'adfit') {
            if (sidebarSlot) {
                sidebarSlot.innerHTML = `<ins class="kakao_ad_area" style="display:none;" data-ad-unit="${AD_CONFIG.adfitUnitSidebar}" data-ad-width="320" data-ad-height="100"></ins>`;
            }
            if (bannerSlot) {
                bannerSlot.innerHTML = `<ins class="kakao_ad_area" style="display:none;" data-ad-unit="${AD_CONFIG.adfitUnitBanner}" data-ad-width="728" data-ad-height="90"></ins>`;
            }
            const s = document.createElement('script');
            s.async = true;
            s.type = 'text/javascript';
            s.src = '//t1.daumcdn.net/kas/static/ba.min.js';
            document.body.appendChild(s);
        } else if (AD_CONFIG.provider === 'adsense') {
            const s = document.createElement('script');
            s.async = true;
            s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.adsenseClient}`;
            s.crossOrigin = 'anonymous';
            document.head.appendChild(s);

            if (sidebarSlot) {
                sidebarSlot.innerHTML = `<ins class="adsbygoogle" style="display:block;width:100%;height:90px" data-ad-client="${AD_CONFIG.adsenseClient}" data-ad-slot="${AD_CONFIG.adsenseSlotSidebar}" data-ad-format="auto"></ins>`;
                try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
            }
            if (bannerSlot) {
                bannerSlot.innerHTML = `<ins class="adsbygoogle" style="display:block;width:100%;height:90px" data-ad-client="${AD_CONFIG.adsenseClient}" data-ad-slot="${AD_CONFIG.adsenseSlotBanner}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
                try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
            }
        }
    }

    // 초기화 실행
    recalculateScale();
    resizeMainCanvas();
    initAdSlots();
});
