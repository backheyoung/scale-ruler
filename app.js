/**
 * ScaleRuler Pro - 컴퓨터용 정밀 화면 자 & CAD 도면 배율 측정기 (KO / EN Bilingual)
 * 100% Client-Side Processing (업로드한 이미지는 서버로 절대 전송되지 않습니다)
 */

// Google AdSense 연동 설정 (나중에 발급받은 코드를 넣으면 자동 활성화됩니다)
const AD_CONFIG = {
    enabled: false,
    adsenseClient: 'ca-pub-0000000000000000',
    adsenseSlotSidebar: '0000000000',
    adsenseSlotBanner: '0000000000'
};

// ============================================================================
// 🌐 다국어 사전 (한국어 / English 완벽 지원)
// ============================================================================
const I18N = {
    ko: {
        badgePrivacy: '사진 서버전송 0% (안심보안)',
        badgePrivacyShort: '보안안심',
        btnCalibrate: '1단계: 2점 배율 보정',
        btnMonitorCalib: '모니터 1:1 보정',
        btnMeasure: '거리 측정',
        btnArea: '면적·평수',
        btnPoly: '연속거리',
        btnAngle: '각도',
        btnPan: '이동',
        btnRuler: '📏 눈금자',
        labelUnit: '단위:',
        labelUnitOnly: '단위',
        btnOpenImage: '사진/도면 열기',
        btnSample: '🏠 샘플 도면',
        btnSavePng: '이미지 저장',
        btnHelp: '❓ 도움말',
        labelCurrentScale: '현재 배율:',
        btnDirectInput: '수치/축척 입력',
        labelBgBrightness: '도면 밝기:',
        btnRemoveBg: '사진제거',
        btnUndo: '↩ 실행취소 (Ctrl+Z)',
        labelCoords: '좌표:',
        btnMobileList: '목록 보기',
        welcomeTitle: '누구나 10초 만에 쓰는 정밀 측정 가이드',
        welcomeStep1: '측정할 도면·사진을 Ctrl+V로 붙여넣거나 상단 [사진/도면 열기]로 불러옵니다.',
        welcomeStep2: '상단 주황색 [1단계: 2점 배율 보정]을 누르고, 실제 길이를 아는 구간의 시작점·끝점을 클릭해 수치를 입력합니다.',
        welcomeStep3: '이제 [거리 측정], [면적·평수], [각도] 버튼으로 어디든 클릭만 하면 실제 치수로 자동 환산됩니다!',
        welcomeBtnSample: '샘플 평면도로 체험하기',
        welcomeBtnDpi: '모니터 1:1 실물 자 맞추기',
        welcomePrivacyNote: '<strong>올린 사진은 어떻게 되나요? (100% 안심 보안)</strong><br>불러온 사진·도면은 외부 서버로 절대 업로드되지 않으며, 오직 현재 사용자의 브라우저 메모리 안에서만 처리된 후 창을 닫으면 즉시 사라집니다.',
        calibPopupTitle: '기준 구간 실제 치수 입력',
        calibPopupDesc1: '방금 클릭한 두 점 사이의 화면 거리는',
        calibPopupDesc2: '입니다. 이 구간의 실제 길이는 얼마입니까?',
        calibPopupApply: '이 수치로 배율 확정 (Enter)',
        btnPinClear: '핀 해제',
        btnRulerOpacity: '투명도',
        sidebarScaleTitle: '기준 배율 (Scale) 설정값',
        btnRecalibrate: '2점 다시 찍기',
        labelRefPx: '기준 픽셀 거리:',
        labelRefReal: '실제 기준 치수:',
        labelRatio: '환산 비율:',
        sidebarLiveTitle: '실시간 측정 수치',
        labelLiveDist: '실제 거리 (ΔL):',
        labelLiveArea: '면적 (㎡·평):',
        labelLivePoly: '누적 총길이:',
        labelLiveAngleMain: '측정 각도:',
        labelLiveCalib: '기준 거리:',
        labelLiveDx: '가로 (ΔX)',
        labelLiveDy: '세로 (ΔY)',
        labelLivePx: '원본 픽셀 (px)',
        labelLiveAngle: '각도 / 평수',
        sidebarListTitle: '측정 기록',
        btnCsv: '엑셀저장',
        btnCopyAll: '전체복사',
        btnClearAll: '비우기',
        emptyListMsg: '아직 측정된 치수선이 없습니다.<br>화면에서 지점을 클릭하면 치수 기록이 저장되며,<br><strong>이름을 클릭해 메모</strong>를 남길 수 있습니다.',
        card1Title: '마우스 2점 클릭 배율 보정',
        card1Body: '축척을 모르는 아파트 평면도, 부동산 도면, 부품 사진이라도 걱정 없습니다. 도면에 적힌 치수 구간 하나만 찾아 시작점과 끝점을 클릭하고 실제 숫자(예: 3600 mm)를 입력하면 전체 도면의 픽셀 대 실제 길이 비율이 자동으로 맞춰집니다.',
        card2Title: '거리 · 면적(평수) · 각도 동시 측정',
        card2Body: '단순 직선 거리뿐만 아니라, 방의 대각선 두 점을 찍어 가로×세로 치수와 면적(㎡ 및 평수)을 한 번에 계산하는 면적 측정 모드, 여러 구간의 합계를 구하는 연속 거리 측정, 3점 각도기 기능을 모두 무료로 제공합니다.',
        card3Title: '모니터 해상도(DPI) 1:1 실물 자',
        card3Body: '사진 없이 모니터 화면에 실제 물건을 대고 길이를 재고 싶다면 상단 [🖥️ 모니터 1:1 보정]을 눌러보세요. 사용 중인 모니터 인치(15.6인치 노트북, 24인치, 27인치, 32인치 등)를 선택하거나 10cm 기준 막대를 조절해 내 모니터에 딱 맞는 1:1 실물 눈금자로 사용할 수 있습니다.',
        secTitle: '이 사이트에 올린 사진·도면은 어떻게 처리되나요? (개인정보 및 보안 안내)',
        secBadge: '서버 전송 ZERO · 100% 로컬 작동',
        secDesc: 'ScaleRuler Pro는 서버리스 클라이언트(Client-Side Only) 아키텍처로 설계되었습니다. 사용자가 Ctrl+V로 붙여넣거나 파일 열기로 선택한 사진·설계 도면은 인터넷을 통해 외부 서버나 클라우드로 단 1바이트도 전송되지 않습니다.',
        secBox1Title: '① 내 기기 안에서만 열림',
        secBox1Body: '브라우저 표준 FileReader와 HTML5 Canvas 기술만을 사용하여 오직 사용자 본인의 PC·스마트폰 화면 메모리에만 이미지를 표시합니다.',
        secBox2Title: '② 외부 유출 원천 차단',
        secBox2Body: '별도의 파일 저장 서버나 데이터베이스(DB) 자체가 존재하지 않으므로, 제3자가 사용자가 올린 도면이나 사진을 열람하거나 수집하는 것이 불가능합니다.',
        secBox3Title: '③ 창을 닫으면 즉시 완전 소멸',
        secBox3Body: '브라우저 탭을 닫거나 새로고침(F5)하는 순간 메모리에서 이미지 데이터가 즉시 파기됩니다. 기업의 보안 도면이나 개인 사진도 안심하고 측정하세요.',
        shortcutTitle: '빠른 작업을 위한 키보드 단축키',
        scPaste: '클립보드 캡처 이미지 바로 붙여넣기',
        scUndo: '방금 측정한 치수선 실행 취소',
        scSnap: '수평(0°) · 대각선(45°) · 수직(90°) 직교 스냅',
        scPan: '도면 화면 드래그 이동 (Pan)',
        scModes: '모드 빠른 전환 (배율 / 거리 / 면적 / 연속 / 각도)',
        scRotate: '플로팅 눈금자 가로 / 세로 회전',
        faqTitle: '자주 묻는 질문 (FAQ)',
        faq1Q: 'Q. 화면을 마우스 휠로 확대/축소하면 측정 치수가 달라지나요?',
        faq1A: '아니요! 모든 기준선과 치수선은 원본 도면의 월드 좌표계를 기준으로 계산되므로, 마우스 휠로 아무리 확대해서 정밀하게 점을 찍어도 실제 치수(mm/cm/m)와 눈금자 간격이 정확하게 연동됩니다.',
        faq2Q: 'Q. 이미 찍은 치수선의 위치를 조금 수정할 수 있나요?',
        faq2A: '네! 측정 완료된 치수선의 양 끝 동그란 마커 위에 마우스를 가져가서 드래그하면 돋보기를 보면서 끝점 위치를 1픽셀 단위로 미세하게 수정할 수 있습니다.',
        faq3Q: 'Q. 측정한 도면을 이미지나 엑셀로 저장할 수 있나요?',
        faq3A: '상단 [💾 이미지 저장] 버튼을 누르면 도면 위에 치수선이 깔끔하게 그려진 PNG 파일이 다운로드되며, 우측 목록의 [엑셀저장] 버튼으로 CSV 표 파일을 내려받을 수 있습니다.',
        footerBrand: 'ScaleRuler Pro (컴퓨터용 정밀 배율 측정 자)',
        footerSub: '본 웹 서비스는 사용자의 이미지나 도면 파일을 서버로 수집·저장하지 않는 100% 브라우저 로컬 기반 무료 유틸리티입니다.',
        footerPrivacy: '개인정보 처리방침',
        footerTerms: '이용약관',
        footerCookie: '쿠키 및 광고 안내',
        footerSecurity: '사진 비저장 보안원리',
        cookieBannerText: '🍪 개인정보 및 쿠키 안내: 본 사이트는 업로드하신 사진·도면을 서버에 절대 저장하지 않습니다. 다만 사용자 설정(배율·테마·언어) 유지 및 맞춤형 광고 제공을 위해 브라우저 쿠키(localStorage 포함)를 사용할 수 있습니다.',
        cookieLearnMore: '자세히 보기',
        cookieAccept: '확인 및 동의',
        modalDirectTitle: '직접 배율 수치 입력',
        modalDirectDesc: '화면의 몇 픽셀(px)이 실제 몇(mm/cm/m/inch)에 해당하는지 직접 입력하거나, 마우스로 2점을 찍어 보정할 수 있습니다.',
        modalDirectPxLabel: '기준 화면 픽셀 길이 (px)',
        modalDirectRealLabel: '대응하는 실제 치수',
        modalDirectSave: '배율 적용하기',
        modalDpiTitle: '모니터 화면 1:1 실물 크기 보정 (모니터 인치 / 10cm 기준)',
        modalDpiDesc: '사용 중인 모니터 크기를 선택하거나, 화면에 실제 자를 대고 아래 노란색 기준 막대의 길이가 정확히 10 cm (100 mm)가 되도록 슬라이더를 조절하세요.',
        modalDpiPresetLabel: '빠른 모니터 프리셋 선택:',
        modalDpiBarHint: '실제 10cm (100mm) 길이와 일치하도록 맞춰주세요 ↔',
        modalDpiSliderLabel: '100 mm 기준 픽셀 크기 조절:',
        modalDpiApply: '이 크기로 1:1 실물 배율 적용하기',
        btnConfirm: '확인',
        // 동적 텍스트
        guideCalibrate: '[1단계: 배율 설정] 실제 치수를 아는 구간의 시작점(1)과 끝점(2)을 클릭하세요. (Shift: 수평/수직 스냅)',
        guideMeasure: '[거리 측정] 길이를 잴 두 지점(시작점 → 끝점)을 클릭하세요. (Shift: 직각 스냅, 끝점 마커 드래그 수정 가능)',
        guideArea: '[면적·평수 측정] 방이나 사각형 영역의 대각선 모서리 두 점(시작 모서리 → 반대쪽 모서리)을 클릭하세요.',
        guidePoly: '[연속 구간 측정] 여러 지점을 순서대로 클릭하고, 끝내려면 [우클릭] 또는 [Enter]를 누르세요.',
        guideAngle: '[각도 측정] 시작점(1) → 꼭짓점(2) → 끝점(3) 순서로 세 지점을 클릭하세요.',
        guidePan: '[화면 이동 모드] 마우스를 드래그하여 도면 위치를 이동하고, 마우스 휠로 확대/축소하세요.',
        typeCalib: '배율 보정',
        typeMeasure: '거리 측정',
        typeArea: '면적·평수',
        typePoly: '연속 거리',
        typeAngle: '각도 측정',
        typePan: '화면 이동',
        canvasRefLine: '기준선',
        canvasRefTemp: '기준 구간',
        canvasClickToInput: '클릭하여 수치 입력',
        canvasWidth: '가로',
        canvasHeight: '세로',
        canvasTotal: '총',
        canvasCumul: '누적',
        canvasRightClickDone: '우클릭 완료',
        canvasClickVertex: '꼭짓점 클릭',
        rulerLabelPrefix: '배율 연동 눈금자',
        rulerTotal: '전체',
        rulerPinDelta: '📌 핀 거리(Δ):',
        toastTwoPointsClose: '두 지점이 너무 가깝습니다. 다시 클릭해 주세요.',
        toastEnterPositive: '0보다 큰 실제 수치를 입력해 주세요.',
        toastCalibDone: '배율 보정 완료! 이제 자유롭게 측정하세요.',
        toastDpiDone: '모니터 1:1 실물 크기(100mm 기준) 보정이 적용되었습니다!',
        toastDirectDone: '직접 배율 설정이 완료되었습니다.',
        toastPolySaved: '연속 구간 거리 측정이 저장되었습니다.',
        toastUndo: '마지막 측정 항목이 취소되었습니다.',
        toastCleared: '모든 측정 기록이 비워졌습니다.',
        toastNoCopy: '복사할 측정 기록이 없습니다.',
        toastCopiedAll: '전체 측정 목록이 클립보드에 복사되었습니다!',
        toastCopiedItem: '복사됨:',
        toastNoCsv: '저장할 측정 기록이 없습니다.',
        toastCsvSaved: '엑셀(CSV) 파일이 다운로드되었습니다.',
        toastPngSaved: '치수선이 포함된 이미지가 PNG로 저장되었습니다!',
        toastImgLoaded: '사진이 로드되었습니다! (서버 전송 없이 내 브라우저에서만 안전하게 열렸습니다)',
        toastBgRemoved: '배경 이미지가 제거되었습니다.',
        toastSampleLoaded: '샘플 평면도가 로드되었습니다! (기준 4200mm 보정 완료)',
        toastClickTwoRef: '기준점 2점을 화면에서 클릭해 주세요.',
        promptRename: '이 측정 항목의 이름(예: 안방 가로, 책상 길이)을 입력하세요:',
        sampleBedroomWidth: '안방 가로폭',
        sampleBedroomArea: '안방 면적'
    },
    en: {
        badgePrivacy: '100% Local Privacy (No Upload)',
        badgePrivacyShort: 'Local Only',
        btnCalibrate: 'Step 1: 2-Pt Scale Calib',
        btnMonitorCalib: '1:1 Monitor DPI',
        btnMeasure: 'Distance',
        btnArea: 'Area',
        btnPoly: 'Multi-Segment',
        btnAngle: 'Angle',
        btnPan: 'Pan',
        btnRuler: '📏 Ruler',
        labelUnit: 'Unit:',
        labelUnitOnly: 'Unit',
        btnOpenImage: 'Open Image/Plan',
        btnSample: '🏠 Sample Plan',
        btnSavePng: 'Save PNG',
        btnHelp: '❓ Guide',
        labelCurrentScale: 'Scale:',
        btnDirectInput: 'Manual Scale',
        labelBgBrightness: 'Image Opacity:',
        btnRemoveBg: 'Remove',
        btnUndo: '↩ Undo (Ctrl+Z)',
        labelCoords: 'Coords:',
        btnMobileList: 'Records',
        welcomeTitle: 'Quick 10-Second Measurement Guide',
        welcomeStep1: 'Paste your blueprint or photo with Ctrl+V, or click [Open Image/Plan] at the top.',
        welcomeStep2: 'Click [Step 1: 2-Pt Scale Calib], click two points of a known dimension, and enter its real length.',
        welcomeStep3: 'Now use [Distance], [Area], or [Angle] to measure anywhere with automatic real-world scale conversion!',
        welcomeBtnSample: 'Try Sample Floorplan',
        welcomeBtnDpi: '1:1 Monitor Calibration',
        welcomePrivacyNote: '<strong>What happens to uploaded photos? (100% Private)</strong><br>Your images and blueprints are NEVER uploaded to any server. Everything runs 100% locally inside your browser memory and disappears when you close the tab.',
        calibPopupTitle: 'Enter Known Real Length',
        calibPopupDesc1: 'The screen distance between the two points is',
        calibPopupDesc2: '. What is the real-world length of this segment?',
        calibPopupApply: 'Apply Scale (Enter)',
        btnPinClear: 'Clear Pins',
        btnRulerOpacity: 'Opacity',
        sidebarScaleTitle: 'Reference Scale Settings',
        btnRecalibrate: 'Re-pick 2 Pts',
        labelRefPx: 'Ref Pixel Dist:',
        labelRefReal: 'Ref Real Length:',
        labelRatio: 'Scale Factor:',
        sidebarLiveTitle: 'Live Readout',
        labelLiveDist: 'Distance (ΔL):',
        labelLiveArea: 'Area (m² / sq.ft):',
        labelLivePoly: 'Total Length:',
        labelLiveAngleMain: 'Angle:',
        labelLiveCalib: 'Ref Dist:',
        labelLiveDx: 'Width (ΔX)',
        labelLiveDy: 'Height (ΔY)',
        labelLivePx: 'Original Pixels',
        labelLiveAngle: 'Angle / Area',
        sidebarListTitle: 'Measurements',
        btnCsv: 'Export CSV',
        btnCopyAll: 'Copy All',
        btnClearAll: 'Clear',
        emptyListMsg: 'No measurements yet.<br>Click points on the canvas to measure.<br>Click any <strong>item badge to rename</strong> it.',
        card1Title: '2-Point Click Scale Calibration',
        card1Body: 'Even if you do not know the scale of a floorplan, blueprint, or photo, simply click the start and end points of one known dimension and enter its real value (e.g., 3600 mm) to calibrate the entire drawing automatically.',
        card2Title: 'Measure Distance, Area & Angles',
        card2Body: 'Measure point-to-point distances, click two diagonal corners to calculate rectangular width × height and area (m² & sq.ft / pyeong), sum multi-segment polylines, or measure 3-point angles effortlessly.',
        card3Title: '1:1 Real-Size Monitor Ruler',
        card3Body: 'Want to hold a physical object against your screen to measure it? Click [🖥️ 1:1 Monitor DPI] and select your screen size (15.6" laptop, 24", 27", 32", etc.) or match the 10cm bar to calibrate a true 1:1 physical screen ruler.',
        secTitle: 'What Happens to Your Uploaded Photos & Blueprints? (Privacy Guarantee)',
        secBadge: 'ZERO Server Upload · 100% Local',
        secDesc: 'ScaleRuler Pro is built on a pure Client-Side Only architecture. Any image or CAD blueprint you open or paste (Ctrl+V) is never transmitted over the internet to any server or cloud storage.',
        secBox1Title: '① Processed Only on Your Device',
        secBox1Body: 'Uses standard browser FileReader and HTML5 Canvas APIs to render images strictly inside your own device memory (RAM).',
        secBox2Title: '② Zero External Access',
        secBox2Body: 'Because there is no backend upload server or database, neither the site operator nor any third party can ever view or collect your files.',
        secBox3Title: '③ Instant Erasure on Close',
        secBox3Body: 'As soon as you close or refresh (F5) the browser tab, the image data is wiped from memory. Safe for confidential blueprints and personal photos.',
        shortcutTitle: 'Keyboard Shortcuts',
        scPaste: 'Paste image from clipboard',
        scUndo: 'Undo last measurement',
        scSnap: '0° / 45° / 90° Ortho Snap',
        scPan: 'Pan canvas view',
        scModes: 'Switch modes (Calib / Dist / Area / Poly / Angle)',
        scRotate: 'Rotate floating ruler (Horizontal / Vertical)',
        faqTitle: 'Frequently Asked Questions (FAQ)',
        faq1Q: 'Q. Does zooming in/out with the mouse wheel affect measurement accuracy?',
        faq1A: 'No! All reference lines and measurements are calculated in the original world coordinate space of your image. Zooming in lets you place points with sub-pixel precision while keeping real dimensions accurate.',
        faq2Q: 'Q. Can I fine-tune an endpoint after placing a measurement?',
        faq2A: 'Yes! Hover over any circular endpoint marker and drag it while watching the 4x/8x magnifier loupe to adjust its position.',
        faq3Q: 'Q. Can I export my measured blueprint or measurement list?',
        faq3A: 'Click [💾 Save PNG] at the top to download a high-resolution image with all dimension lines drawn on it, or click [Export CSV] in the sidebar to download a spreadsheet file.',
        footerBrand: 'ScaleRuler Pro (Online Screen & CAD Scale Ruler)',
        footerSub: '100% client-side free web utility. Your images and blueprints are never uploaded to or stored on any server.',
        footerPrivacy: 'Privacy Policy',
        footerTerms: 'Terms of Service',
        footerCookie: 'Cookie & Ad Policy',
        footerSecurity: 'Local Privacy Guarantee',
        cookieBannerText: '🍪 Privacy & Cookie Notice: This site never uploads your images to any server. We use browser storage (localStorage) and cookies to remember your preferences (scale, theme, language) and serve relevant ads.',
        cookieLearnMore: 'Learn More',
        cookieAccept: 'Accept & Close',
        modalDirectTitle: 'Manual Scale Input',
        modalDirectDesc: 'Enter how many screen pixels (px) correspond to a known real-world length (mm/cm/m/inch).',
        modalDirectPxLabel: 'Reference Pixel Length (px)',
        modalDirectRealLabel: 'Corresponding Real Value',
        modalDirectSave: 'Apply Scale',
        modalDpiTitle: '1:1 Physical Monitor Calibration (Screen Size / 10cm Bar)',
        modalDpiDesc: 'Select your monitor size preset below, or hold a physical ruler against your screen and adjust the slider until the yellow bar is exactly 10 cm (100 mm) wide.',
        modalDpiPresetLabel: 'Quick Monitor Size Presets:',
        modalDpiBarHint: 'Match this bar to exactly 10 cm (100 mm) ↔',
        modalDpiSliderLabel: 'Adjust Pixel Width for 100 mm:',
        modalDpiApply: 'Apply 1:1 Physical Scale',
        btnConfirm: 'OK',
        // Dynamic strings
        guideCalibrate: '[Step 1: Calibrate] Click the start (1) and end (2) points of a known dimension on your image. (Hold Shift to snap)',
        guideMeasure: '[Distance Mode] Click two points (Start → End) to measure length. (Hold Shift to snap, drag endpoints to fine-tune)',
        guideArea: '[Area Mode] Click two opposite diagonal corners of a room or rectangle to measure Width × Height & Area.',
        guidePoly: '[Multi-Segment Mode] Click multiple points sequentially. Right-click, double-click, or press Enter to finish.',
        guideAngle: '[Angle Mode] Click 3 points in order: Start (1) → Vertex (2) → End (3).',
        guidePan: '[Pan Mode] Drag to move the canvas view, and use the mouse wheel to zoom in/out.',
        typeCalib: 'Calibrate',
        typeMeasure: 'Distance',
        typeArea: 'Area',
        typePoly: 'Polyline',
        typeAngle: 'Angle',
        typePan: 'Pan',
        canvasRefLine: 'Ref',
        canvasRefTemp: 'Ref Dist',
        canvasClickToInput: 'Click to enter value',
        canvasWidth: 'W',
        canvasHeight: 'H',
        canvasTotal: 'Total',
        canvasCumul: 'Sum',
        canvasRightClickDone: 'Right-click to finish',
        canvasClickVertex: 'Click vertex',
        rulerLabelPrefix: 'Scale Ruler',
        rulerTotal: 'Total',
        rulerPinDelta: '📌 Pin Δ:',
        toastTwoPointsClose: 'The two points are too close. Please click again.',
        toastEnterPositive: 'Please enter a valid number greater than 0.',
        toastCalibDone: 'Scale calibrated! You can now measure freely.',
        toastDpiDone: '1:1 Monitor physical scale (100mm ref) applied!',
        toastDirectDone: 'Manual scale settings applied.',
        toastPolySaved: 'Multi-segment polyline measurement saved.',
        toastUndo: 'Last measurement undone.',
        toastCleared: 'All measurements cleared.',
        toastNoCopy: 'No measurements to copy.',
        toastCopiedAll: 'All measurements copied to clipboard!',
        toastCopiedItem: 'Copied:',
        toastNoCsv: 'No measurements to export.',
        toastCsvSaved: 'CSV spreadsheet file downloaded.',
        toastPngSaved: 'Measured image saved as PNG!',
        toastImgLoaded: 'Image loaded locally! (100% processed inside your browser)',
        toastBgRemoved: 'Background image removed.',
        toastSampleLoaded: 'Sample floorplan loaded! (Calibrated to 4200mm)',
        toastClickTwoRef: 'Click 2 reference points on the screen.',
        promptRename: 'Enter a label name for this measurement (e.g., Living Room Width):',
        sampleBedroomWidth: 'Bedroom Width',
        sampleBedroomArea: 'Bedroom Area'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const UNIT_TO_MM = {
        mm: 1,
        cm: 10,
        m: 1000,
        inch: 25.4
    };
    const M2_PER_PYEONG = 3.305785;
    const SQFT_PER_M2 = 10.7639104;

    const state = {
        lang: 'ko',               // 'ko' | 'en'
        mode: 'measure',          // 'calibrate' | 'measure' | 'area' | 'poly' | 'angle' | 'pan'
        displayUnit: 'mm',        // 'mm' | 'cm' | 'm' | 'inch' | 'px'

        refPx: 100,
        refRealValue: 100,
        refRealUnit: 'mm',
        mmPerPixel: 1.0,

        calibLine: null,
        tempPoints: [],
        mouseWorld: { x: 0, y: 0 },
        mouseScreen: { x: 0, y: 0 },
        isShiftDown: false,
        isSpaceDown: false,

        measurements: [],
        nextId: 1,

        draggingHandle: null,
        hoveredHandle: null,

        zoom: 1.0,
        panX: 0,
        panY: 0,
        isPanning: false,
        panStartMouse: { x: 0, y: 0 },
        panStartOffset: { x: 0, y: 0 },

        bgImage: null,
        bgOpacity: 1.0,

        rulerVisible: true,
        rulerOrientation: 'horizontal',
        rulerX: 60,
        rulerY: 380,
        rulerLength: 660,
        rulerBreadth: 86,
        rulerOpacityMode: 0,
        rulerPins: [],

        loupeZoom: 4
    };

    function t(key) {
        return I18N[state.lang][key] || I18N.ko[key] || key;
    }

    // --- DOM 참조 ---
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

    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // --- 로컬 스토리지 및 초기 언어 복원 ---
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const paramLang = urlParams.get('lang');
        const savedLang = localStorage.getItem('sr_lang');
        if (paramLang === 'en' || paramLang === 'ko') {
            state.lang = paramLang;
        } else if (savedLang === 'en' || savedLang === 'ko') {
            state.lang = savedLang;
        } else if (navigator.language && !navigator.language.toLowerCase().startsWith('ko')) {
            state.lang = 'en';
        }

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
    } catch (err) {}

    // --- 언어 변경 적용 함수 ---
    function applyLanguage(lang) {
        state.lang = lang;
        document.documentElement.lang = lang;
        document.getElementById('lang-toggle-label').textContent = lang === 'ko' ? 'EN' : '한국어';

        try { localStorage.setItem('sr_lang', lang); } catch (e) {}

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            if (key === 'welcomePrivacyNote') {
                el.innerHTML = val;
            } else {
                el.textContent = val;
            }
        });

        setMode(state.mode);
        recalculateScale();
    }

    document.getElementById('btn-lang-toggle').addEventListener('click', () => {
        applyLanguage(state.lang === 'ko' ? 'en' : 'ko');
    });

    document.getElementById('btn-accept-cookies').addEventListener('click', () => {
        try { localStorage.setItem('sr_cookie_consent', '1'); } catch (e) {}
        document.getElementById('cookie-banner').classList.add('hidden');
    });

    // --- 토스트 알림 ---
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

    // --- 좌표 변환 ---
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
                extra: '-'
            };
        }
        const wMm = widthPx * state.mmPerPixel;
        const hMm = heightPx * state.mmPerPixel;
        const areaM2 = (wMm * hMm) / 1_000_000;

        if (state.lang === 'en') {
            const sqft = areaM2 * SQFT_PER_M2;
            const mainStr = areaM2 >= 0.05
                ? `${areaM2.toFixed(2)} m² (${sqft.toFixed(1)} sq.ft)`
                : `${((wMm * hMm) / 100).toFixed(1)} cm²`;
            return {
                main: mainStr,
                sub: `W ${formatWorldDistance(widthPx)} × H ${formatWorldDistance(heightPx)}`,
                extra: `${sqft.toFixed(1)} sq.ft`
            };
        } else {
            const pyeong = areaM2 / M2_PER_PYEONG;
            const mainStr = areaM2 >= 0.05
                ? `${areaM2.toFixed(2)} m² (${pyeong.toFixed(2)}평)`
                : `${((wMm * hMm) / 100).toFixed(1)} cm²`;
            return {
                main: mainStr,
                sub: `가로 ${formatWorldDistance(widthPx)} × 세로 ${formatWorldDistance(heightPx)}`,
                extra: `${pyeong.toFixed(2)}평`
            };
        }
    }

    // --- 배율 재계산 ---
    function recalculateScale() {
        const realMm = state.refRealValue * UNIT_TO_MM[state.refRealUnit];
        state.mmPerPixel = realMm / state.refPx;

        const unit = state.displayUnit === 'px' ? state.refRealUnit : state.displayUnit;
        const perPxInDisplayUnit = state.mmPerPixel / (UNIT_TO_MM[unit] || 1);

        document.getElementById('badge-scale-status').textContent =
            `${state.refPx.toFixed(1)} px = ${state.refRealValue} ${state.refRealUnit} (1 px = ${perPxInDisplayUnit.toFixed(4)} ${unit})`;

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
            guideText.textContent = t('guideCalibrate');
            liveTypeBadge.textContent = t('typeCalib');
            liveMainLabel.textContent = t('labelLiveCalib');
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'measure') {
            document.getElementById('btn-mode-measure').classList.add('active');
            guideText.textContent = t('guideMeasure');
            liveTypeBadge.textContent = t('typeMeasure');
            liveMainLabel.textContent = t('labelLiveDist');
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'area') {
            document.getElementById('btn-mode-area').classList.add('active-area');
            guideText.textContent = t('guideArea');
            liveTypeBadge.textContent = t('typeArea');
            liveMainLabel.textContent = t('labelLiveArea');
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'poly') {
            document.getElementById('btn-mode-poly').classList.add('active-poly');
            guideText.textContent = t('guidePoly');
            liveTypeBadge.textContent = t('typePoly');
            liveMainLabel.textContent = t('labelLivePoly');
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'angle') {
            document.getElementById('btn-mode-angle').classList.add('active');
            guideText.textContent = t('guideAngle');
            liveTypeBadge.textContent = t('typeAngle');
            liveMainLabel.textContent = t('labelLiveAngleMain');
            viewport.style.cursor = 'crosshair';
        } else if (newMode === 'pan') {
            document.getElementById('btn-mode-pan').classList.add('active');
            guideText.textContent = t('guidePan');
            liveTypeBadge.textContent = t('typePan');
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
        showToast(t('toastClickTwoRef'));
    });

    document.getElementById('select-unit').addEventListener('change', (e) => {
        state.displayUnit = e.target.value;
        recalculateScale();
    });

    // --- 끝점 핸들 히트 테스트 ---
    function findHandleAtScreenPos(sx, sy) {
        const hitRadius = 9;
        for (let i = state.measurements.length - 1; i >= 0; i--) {
            const m = state.measurements[i];
            for (let pIdx = 0; pIdx < m.points.length; pIdx++) {
                const sp = worldToScreen(m.points[pIdx].x, m.points[pIdx].y);
                if (Math.hypot(sp.x - sx, sp.y - sy) <= hitRadius) {
                    return { target: 'measurement', mIndex: i, ptIndex: pIdx };
                }
            }
        }
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

        drawGrid(width, height);

        if (state.bgImage) {
            ctx.save();
            ctx.globalAlpha = state.bgOpacity;
            ctx.translate(state.panX, state.panY);
            ctx.scale(state.zoom, state.zoom);
            ctx.drawImage(state.bgImage, 0, 0);
            ctx.restore();
        }

        if (state.calibLine) {
            const p1 = worldToScreen(state.calibLine.x1, state.calibLine.y1);
            const p2 = worldToScreen(state.calibLine.x2, state.calibLine.y2);
            const label = `${t('canvasRefLine')}: ${state.refRealValue}${state.refRealUnit} (${state.refPx.toFixed(1)}px)`;
            drawDimensionLineScreen(p1, p2, label, '#f59e0b', true);
        }

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
                drawPolylineScreen(screenPts, `${prefix}${t('canvasTotal')} ${formatWorldDistance(totalPx)}`, '#06b6d4', false);
            } else if (m.type === 'angle') {
                const p1 = worldToScreen(m.points[0].x, m.points[0].y);
                const vertex = worldToScreen(m.points[1].x, m.points[1].y);
                const p3 = worldToScreen(m.points[2].x, m.points[2].y);
                const deg = calculateAngleDeg(m.points[0], m.points[1], m.points[2]);
                drawAngleScreen(p1, vertex, p3, `${prefix}${deg.toFixed(1)}°`, '#c084fc');
            }
        });

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

        if (state.tempPoints.length > 0) {
            const lastPt = state.tempPoints[state.tempPoints.length - 1];
            const snappedWorld = applyOrthoSnap(lastPt, state.mouseWorld);

            if (state.mode === 'calibrate' || state.mode === 'measure') {
                const p1 = worldToScreen(state.tempPoints[0].x, state.tempPoints[0].y);
                const p2 = worldToScreen(snappedWorld.x, snappedWorld.y);
                const distPx = Math.hypot(snappedWorld.x - state.tempPoints[0].x, snappedWorld.y - state.tempPoints[0].y);
                const color = state.mode === 'calibrate' ? '#fbbf24' : '#34d399';
                const label = state.mode === 'calibrate'
                    ? `${t('canvasRefTemp')}: ${distPx.toFixed(1)} px (${t('canvasClickToInput')})`
                    : `${formatWorldDistance(distPx)} (${distPx.toFixed(1)}px)`;
                drawDimensionLineScreen(p1, p2, label, color, true);
                updateLiveReadout(state.tempPoints[0], snappedWorld, 'distance');
            } else if (state.mode === 'area') {
                const p1 = worldToScreen(state.tempPoints[0].x, state.tempPoints[0].y);
                const p2 = worldToScreen(state.mouseWorld.x, state.mouseWorld.y);
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
                drawPolylineScreen(screenPts, `${t('canvasCumul')}: ${formatWorldDistance(totalPx)} (${t('canvasRightClickDone')})`, '#22d3ee', true);
                updateLiveReadout(lastPt, snappedWorld, 'distance', totalPx);
            } else if (state.mode === 'angle') {
                if (state.tempPoints.length === 1) {
                    const p1 = worldToScreen(state.tempPoints[0].x, state.tempPoints[0].y);
                    const p2 = worldToScreen(snappedWorld.x, snappedWorld.y);
                    drawDimensionLineScreen(p1, p2, t('canvasClickVertex'), '#c084fc', true);
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
            drawPillBadge(x + w / 2, y - 12, `${t('canvasWidth')} ${widthLabel}`, '#34d399');
            drawPillBadge(x + w + 42, y + h / 2, `${t('canvasHeight')} ${heightLabel}`, '#34d399');
        }
        ctx.restore();
    }

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
            document.getElementById('live-angle').textContent = areaInfo.extra;
        } else {
            document.getElementById('live-dist').textContent = formatWorldDistance(distPx);
            document.getElementById('live-dx').textContent = formatWorldDistance(dxPx);
            document.getElementById('live-dy').textContent = formatWorldDistance(dyPx);
            document.getElementById('live-px').textContent = `${distPx.toFixed(1)} px`;
            document.getElementById('live-angle').textContent = `${angleDeg.toFixed(1)}°`;
        }
    }

    // --- 정밀 돋보기 (Loupe) ---
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

    // --- 포인터 / 마우스 / 터치 이벤트 ---
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

        if (e.button === 1 || state.isSpaceDown || state.mode === 'pan') {
            e.preventDefault();
            state.isPanning = true;
            state.panStartMouse = { x: e.clientX, y: e.clientY };
            state.panStartOffset = { x: state.panX, y: state.panY };
            viewport.style.cursor = 'grabbing';
            return;
        }

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

        if (state.mode === 'calibrate') {
            state.tempPoints.push(worldPt);
            if (state.tempPoints.length === 2) {
                const p1 = state.tempPoints[0];
                const p2 = state.tempPoints[1];
                const distPx = Math.hypot(p2.x - p1.x, p2.y - p1.y);
                if (distPx < 1) {
                    showToast(t('toastTwoPointsClose'));
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
            showToast(t('toastPolySaved'));
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
            showToast(t('toastUndo'));
        }
    }
    document.getElementById('btn-undo').addEventListener('click', undoLastAction);

    // --- 기준점 2점 클릭 팝업 ---
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
            showToast(t('toastEnterPositive'));
            return;
        }
        state.refRealValue = val;
        state.refRealUnit = unit;
        state.displayUnit = unit;
        document.getElementById('select-unit').value = unit;

        calibPopup.classList.add('hidden');
        recalculateScale();
        setMode('measure');
        showToast(t('toastCalibDone'));
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

    // --- 모니터 인치 / 10cm 기준 1:1 실물 크기 보정 모달 ---
    const modalDpiCalib = document.getElementById('modal-dpi-calib');
    const sliderDpiPx = document.getElementById('slider-dpi-px');
    const dpiPreviewBar = document.getElementById('dpi-preview-bar');
    const dpiPxLabel = document.getElementById('dpi-px-label');

    function updateDpiPreview(pxWidth) {
        dpiPreviewBar.style.width = `${pxWidth}px`;
        const dpi = (pxWidth / (100.0 / 25.4)).toFixed(1);
        dpiPxLabel.textContent = `${pxWidth} px = 100.0 mm (${dpi} DPI)`;
    }

    function openDpiCalibModal() {
        modalDpiCalib.classList.remove('hidden');
        modalDpiCalib.classList.add('flex');
        const current100mmPx = Math.max(200, Math.min(700, Math.round(100.0 / state.mmPerPixel)));
        sliderDpiPx.value = current100mmPx;
        updateDpiPreview(current100mmPx);
    }

    document.getElementById('btn-open-dpi-calib').addEventListener('click', openDpiCalibModal);
    document.getElementById('btn-welcome-dpi').addEventListener('click', openDpiCalibModal);
    document.getElementById('btn-close-dpi-modal').addEventListener('click', () => {
        modalDpiCalib.classList.add('hidden');
        modalDpiCalib.classList.remove('flex');
    });

    sliderDpiPx.addEventListener('input', (e) => {
        updateDpiPreview(parseInt(e.target.value, 10));
    });

    document.querySelectorAll('.monitor-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const ppi = parseFloat(btn.dataset.ppi);
            const barPx = Math.round((100.0 / 25.4) * ppi);
            sliderDpiPx.value = barPx;
            updateDpiPreview(barPx);
        });
    });

    document.getElementById('btn-apply-dpi-calib').addEventListener('click', () => {
        const px = parseFloat(sliderDpiPx.value);
        state.refPx = px;
        state.refRealValue = 100;
        state.refRealUnit = 'mm';
        state.displayUnit = 'mm';
        state.calibLine = null;
        document.getElementById('select-unit').value = 'mm';
        modalDpiCalib.classList.add('hidden');
        modalDpiCalib.classList.remove('flex');
        recalculateScale();
        showToast(t('toastDpiDone'));
    });

    // --- 우측 측정 목록 렌더링 ---
    function getMeasurementSummary(m, index) {
        const labelPrefix = m.name ? m.name : `#${index + 1}`;
        if (m.type === 'distance') {
            const dx = Math.abs(m.points[1].x - m.points[0].x);
            const dy = Math.abs(m.points[1].y - m.points[0].y);
            const distPx = Math.hypot(dx, dy);
            return {
                badge: labelPrefix,
                typeStr: t('typeMeasure'),
                title: formatWorldDistance(distPx),
                sub: `${t('canvasWidth')} ${formatWorldDistance(dx)} · ${t('canvasHeight')} ${formatWorldDistance(dy)} (${distPx.toFixed(1)}px)`,
                rawPx: distPx.toFixed(1)
            };
        } else if (m.type === 'area') {
            const dx = Math.abs(m.points[1].x - m.points[0].x);
            const dy = Math.abs(m.points[1].y - m.points[0].y);
            const areaInfo = formatArea(dx, dy);
            return {
                badge: labelPrefix,
                typeStr: t('typeArea'),
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
                typeStr: t('typePoly'),
                title: `${t('canvasTotal')} ${formatWorldDistance(totalPx)}`,
                sub: `${m.points.length - 1} seg (${totalPx.toFixed(1)}px)`,
                rawPx: totalPx.toFixed(1)
            };
        } else {
            const deg = calculateAngleDeg(m.points[0], m.points[1], m.points[2]);
            return {
                badge: labelPrefix,
                typeStr: t('typeAngle'),
                title: `${deg.toFixed(1)}°`,
                sub: `3-Pt Angle`,
                rawPx: '-'
            };
        }
    }

    function renderMeasurementList() {
        const listEl = document.getElementById('measurement-list');
        const countEl = document.getElementById('measurement-count');
        countEl.textContent = state.measurements.length;

        if (state.measurements.length === 0) {
            listEl.innerHTML = `<div class="text-center text-slate-500 py-6 text-xs leading-relaxed">${t('emptyListMsg')}</div>`;
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
                        <button data-idx="${index}" class="btn-rename-item text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold cursor-pointer" title="Rename">
                            ✏️ ${info.badge}
                        </button>
                        <span class="font-mono-num font-bold text-xs sm:text-sm text-amber-300 truncate">${info.title}</span>
                    </div>
                    <div class="text-[10px] font-mono-num text-slate-400 mt-1 truncate">${info.sub}</div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button data-copy="${info.badge}: ${info.title}" class="btn-copy-item p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer" title="Copy">
                        📋
                    </button>
                    <button data-idx="${index}" class="btn-del-item p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer" title="Delete">
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
                const newName = prompt(t('promptRename'), currentName);
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
                showToast(`${t('toastCopiedItem')} ${btn.dataset.copy}`);
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
        showToast(t('toastCleared'));
    });

    document.getElementById('btn-copy-all').addEventListener('click', () => {
        if (state.measurements.length === 0) {
            showToast(t('toastNoCopy'));
            return;
        }
        const lines = state.measurements.map((m, i) => {
            const info = getMeasurementSummary(m, i);
            return `${info.badge} [${info.typeStr}] : ${info.title} (${info.sub})`;
        });
        navigator.clipboard?.writeText(lines.join('\n'));
        showToast(t('toastCopiedAll'));
    });

    document.getElementById('btn-export-csv').addEventListener('click', () => {
        if (state.measurements.length === 0) {
            showToast(t('toastNoCsv'));
            return;
        }
        const headers = state.lang === 'en'
            ? ['No', 'Label', 'Type', 'Result', 'Details', 'Pixels']
            : ['번호', '이름', '측정유형', '측정결과', '상세내역', '원본픽셀'];
        const rows = [headers];
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
        showToast(t('toastCsvSaved'));
    });

    document.getElementById('btn-export-png').addEventListener('click', () => {
        const exportCanvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        exportCanvas.width = mainCanvas.width;
        exportCanvas.height = mainCanvas.height;
        const eCtx = exportCanvas.getContext('2d');

        const isLight = document.documentElement.classList.contains('light-mode');
        eCtx.fillStyle = isLight ? '#f8fafc' : '#020617';
        eCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        eCtx.drawImage(mainCanvas, 0, 0);

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
        showToast(t('toastPngSaved'));
    });

    // --- 플로팅 눈금자 ---
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
            rulerScaleLabel.textContent = `${t('rulerPinDelta')} ${formatWorldDistance(deltaWorldPx)} (${t('rulerTotal')} ${formatWorldDistance(state.rulerLength / state.zoom)})`;
            btnRulerPinClear.classList.remove('hidden');
        } else {
            rulerScaleLabel.textContent = `${t('rulerLabelPrefix')} (${state.displayUnit}) · ${t('rulerTotal')} ${formatWorldDistance(state.rulerLength / state.zoom)}`;
            btnRulerPinClear.classList.toggle('hidden', state.rulerPins.length === 0);
        }
    }

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
            showToast(t('toastDirectDone'));
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
                showToast(t('toastImgLoaded'));
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
        showToast(t('toastBgRemoved'));
    });

    document.getElementById('btn-close-welcome').addEventListener('click', () => {
        document.getElementById('welcome-overlay').classList.add('hidden');
    });

    function loadSampleFloorplan() {
        const c = document.createElement('canvas');
        c.width = 920;
        c.height = 620;
        const g = c.getContext('2d');

        g.fillStyle = '#0f172a';
        g.fillRect(0, 0, c.width, c.height);

        g.strokeStyle = '#334155';
        g.lineWidth = 2;
        g.strokeRect(24, 24, c.width - 48, c.height - 48);

        g.fillStyle = '#1e293b';
        g.fillRect(80, 110, 780, 420);

        g.strokeStyle = '#e2e8f0';
        g.lineWidth = 6;
        g.strokeRect(80, 110, 780, 420);

        g.beginPath();
        g.moveTo(500, 110);
        g.lineTo(500, 530);
        g.moveTo(80, 350);
        g.lineTo(500, 350);
        g.stroke();

        g.fillStyle = '#94a3b8';
        g.font = 'bold 20px "Noto Sans KR", sans-serif';
        g.textAlign = 'center';
        g.fillText('거실 (Living Room)', 290, 225);
        g.font = '14px "JetBrains Mono", monospace';
        g.fillStyle = '#64748b';
        g.fillText('4200 × 2400 mm', 290, 252);

        g.fillStyle = '#94a3b8';
        g.font = 'bold 20px "Noto Sans KR", sans-serif';
        g.fillText('안방 (Master Bedroom)', 680, 305);
        g.font = '14px "JetBrains Mono", monospace';
        g.fillStyle = '#64748b';
        g.fillText('3600 × 4200 mm', 680, 332);

        g.fillStyle = '#94a3b8';
        g.font = 'bold 18px "Noto Sans KR", sans-serif';
        g.fillText('주방 / 다이닝 (Kitchen)', 290, 435);
        g.font = '13px "JetBrains Mono", monospace';
        g.fillStyle = '#64748b';
        g.fillText('4200 × 1800 mm', 290, 460);

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
        g.fillText('◀ Reference Dimension: 4200 mm ▶', 290, 62);

        g.fillStyle = '#475569';
        g.font = '12px "JetBrains Mono", sans-serif';
        g.textAlign = 'right';
        g.fillText('SAMPLE CAD PLAN · SCALE 1 px = 10 mm', c.width - 40, c.height - 38);

        loadImageFromSrc(c.toDataURL('image/png'), true);

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
                name: t('sampleBedroomWidth')
            },
            {
                id: state.nextId++,
                type: 'area',
                points: [{ x: 500, y: 110 }, { x: 860, y: 530 }],
                name: t('sampleBedroomArea')
            }
        ];

        recalculateScale();
        setMode('measure');
        showToast(t('toastSampleLoaded'));
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

    // --- 보안 및 쿠키 안내 모달 (한국어 / 영어 자동 전환) ---
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

    function showSecurityModal() {
        if (state.lang === 'en') {
            openInfoModal('🛡️ 100% Local Privacy & Image Security Guarantee', `
                <div class="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 text-emerald-200 space-y-2">
                    <div class="font-extrabold text-sm">🔒 Your uploaded images and blueprints are NEVER sent to any server!</div>
                    <p>Every image you open or paste (<kbd class="px-1.5 py-0.5 bg-slate-800 rounded">Ctrl+V</kbd>) is processed strictly inside your own device's web browser memory (RAM).</p>
                </div>
                <h4 class="font-bold text-white text-xs pt-2">1. How It Works (100% Client-Side Processing)</h4>
                <ul class="list-disc list-inside space-y-1.5 text-slate-300">
                    <li>Unlike traditional web tools that upload files to a remote server, ScaleRuler Pro has <strong>zero file upload network requests</strong>.</li>
                    <li>It uses standard browser <code class="text-amber-300">FileReader.readAsDataURL()</code> and <code class="text-amber-300">HTML5 Canvas</code> APIs locally on your computer or phone.</li>
                </ul>
                <h4 class="font-bold text-white text-xs pt-2">2. Instant Erasure</h4>
                <p>When you close the browser tab or refresh the page, the image data in your browser memory is immediately destroyed. Confidential CAD drawings, floorplans, and personal photos remain 100% private.</p>
            `);
        } else {
            openInfoModal('🛡️ 업로드 사진 처리 방식 및 개인정보 보안 안내', `
                <div class="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 text-emerald-200 space-y-2">
                    <div class="font-extrabold text-sm">🔒 결론부터 말씀드리면: 업로드하신 사진은 서버에 절대 전송되거나 저장되지 않습니다!</div>
                    <p>이 웹사이트에 올리신 도면, 사진, 캡처 화면은 인터넷을 통해 어디로도 전송되지 않으며, <strong>오직 현재 보고 계신 사용자의 컴퓨터·스마트폰 브라우저 메모리(RAM) 안에서만</strong> 열립니다.</p>
                </div>
                <h4 class="font-bold text-white text-xs pt-2">1. 기술적 동작 원리 (100% Client-Side Processing)</h4>
                <ul class="list-disc list-inside space-y-1.5 text-slate-300">
                    <li>일반적인 파일 업로드 사이트와 달리 ScaleRuler Pro에는 <strong>서버 전송 코드 자체가 존재하지 않습니다.</strong></li>
                    <li>웹 브라우저 내장 <code class="text-amber-300">FileReader.readAsDataURL()</code> 및 <code class="text-amber-300">HTML5 Canvas</code> API만을 사용해 내 컴퓨터 안에서 즉시 이미지를 화면에 그립니다.</li>
                </ul>
                <h4 class="font-bold text-white text-xs pt-2">2. 창을 닫으면 사진은 어떻게 되나요?</h4>
                <p>브라우저 탭을 닫거나 새로고침(<kbd class="px-1.5 py-0.5 bg-slate-800 rounded">F5</kbd>)하는 즉시 브라우저 메모리(RAM)에서 사진 데이터가 완전히 소멸됩니다. 사이트 운영자나 제3자는 사용자가 어떤 사진을 열었는지 절대 알 수 없으므로 안심하고 측정하실 수 있습니다.</p>
            `);
        }
    }

    document.getElementById('btn-privacy-badge').addEventListener('click', showSecurityModal);
    document.getElementById('btn-footer-security').addEventListener('click', showSecurityModal);

    document.getElementById('btn-footer-cookie').addEventListener('click', () => {
        if (state.lang === 'en') {
            openInfoModal('🍪 Cookie & Advertising Policy', `
                <p><strong>ScaleRuler Pro</strong> uses minimal browser storage (<code class="text-amber-300">localStorage</code>) and third-party advertising cookies to keep this utility free.</p>
                <h4 class="font-bold text-white text-xs pt-2">1. Local Preferences</h4>
                <ul class="list-disc list-inside space-y-1">
                    <li>Stores your last calibrated scale ratio, preferred measurement unit, language, and dark/light theme setting locally on your browser.</li>
                </ul>
                <h4 class="font-bold text-white text-xs pt-2">2. Google AdSense & Third-Party Cookies</h4>
                <ul class="list-disc list-inside space-y-1">
                    <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
                    <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener" class="underline text-amber-300">Google Ads Settings</a>.</li>
                </ul>
                <div class="pt-2">
                    <a href="privacy.html?lang=en" class="text-amber-300 underline font-bold">👉 View Full Privacy Policy</a>
                </div>
            `);
        } else {
            openInfoModal('🍪 쿠키 및 맞춤형 광고 정책 안내', `
                <p><strong>ScaleRuler Pro</strong>는 이용자의 편의를 위해 최소한의 브라우저 저장소(<code class="text-amber-300">localStorage</code>) 및 제3자 광고 쿠키를 사용합니다.</p>
                <h4 class="font-bold text-white text-xs pt-2">1. 필수 기능 저장 항목</h4>
                <ul class="list-disc list-inside space-y-1">
                    <li>마지막으로 보정한 배율 수치(px 대 실제 단위 비율), 선택 언어 및 화면 테마(다크/라이트 모드)</li>
                </ul>
                <h4 class="font-bold text-white text-xs pt-2">2. Google AdSense 및 제3자 광고 쿠키 안내</h4>
                <ul class="list-disc list-inside space-y-1">
                    <li>Google을 포함한 제3자 광고 사업자는 쿠키를 사용하여 이용자의 이전 웹사이트 방문 기록을 바탕으로 맞춤형 광고를 제공할 수 있습니다.</li>
                    <li>이용자는 언제든지 <a href="https://adssettings.google.com" target="_blank" rel="noopener" class="underline text-amber-300">Google 광고 설정</a> 페이지에서 맞춤형 광고를 해제하거나 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다.</li>
                </ul>
                <div class="pt-2">
                    <a href="privacy.html" class="text-amber-300 underline font-bold">👉 전체 개인정보 처리방침 전문 페이지 보기</a>
                </div>
            `);
        }
    });

    // --- AdSense 슬롯 자동 렌더링 (발급 후 AD_CONFIG.enabled = true 시 자동 표시) ---
    function initAdSlots() {
        if (!AD_CONFIG.enabled) return;
        const sidebarWrapper = document.getElementById('sidebar-ad-wrapper');
        const bannerWrapper = document.getElementById('banner-ad-wrapper');
        const sidebarSlot = document.getElementById('ad-slot-sidebar');
        const bannerSlot = document.getElementById('ad-slot-banner');

        if (sidebarWrapper) sidebarWrapper.classList.remove('hidden');
        if (bannerWrapper) bannerWrapper.classList.remove('hidden');

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

    // 초기화 실행
    applyLanguage(state.lang);
    resizeMainCanvas();
    initAdSlots();
});
