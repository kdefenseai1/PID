import { Language } from './types';

export const translations = {
  en: {
    nav: {
      title: "SENTINEL_ID",
      enroll: "Enroll",
      identify: "Identify",
      db: "DB",
      settings: "Settings",
      arch: "Arch",
      manual: "Manual",
      security: "Security",
      themeDark: "Dark",
      themeLight: "Light",
      langKo: "Korean",
      langEn: "English"
    },
    loading: {
      title: "INITIALIZING SYSTEM",
      desc: "Loading Neural Networks..."
    },
    enroll: {
      title: "New Subject Enrollment",
      instruction: "Upload one or more photos of the subject. Different angles improve accuracy.",
      labelName: "Subject Identity (Name)",
      labelTitle: "Position / Role",
      labelGender: "Gender",
      labelBirth: "Date of Birth",
      labelAge: "Age",
      placeholderName: "Enter full name...",
      placeholderTitle: "e.g. Senior Researcher",
      placeholderGender: "e.g. Male/Female",
      placeholderBirth: "e.g. 1980-01-01 or 1980",
      placeholderAge: "Auto-calc or e.g. 35",
      quality: "Face Analysis",
      optimal: "FACES DETECTED",
      waiting: "WAITING FOR UPLOAD...",
      save: "SAVE BIOMETRIC DATA",
      vectorLocked: "VECTOR_LOCKED",
      errorName: "Please enter at least Name and Role.",
      errorFace: "No valid faces detected in uploaded images.",
      success: "Personnel enrolled successfully!",
      modeCamera: "Camera",
      modeUpload: "Batch Upload",
      uploadLabel: "Select Images",
      uploadDesc: "Select multiple photos (JPG, PNG)",
      processing: "Processing...",
      validCount: "{count} valid faces ready"
    },
    recognize: {
      title: "Live Identification",
      matchFound: "MATCH FOUND",
      noMatch: "UNIDENTIFIED SUBJECT",
      noMatchDesc: "No matching biometric record found in database.",
      unknown: "UNKNOWN",
      analysisTitle: "Person Analysis",
      confidence: "CONFIDENCE",
      confidenceLevel: {
        level1: "HIGH PROBABILITY MATCH",
        level2: "HIGH MATCH LIKELIHOOD",
        level3: "MATCH LIKELIHOOD",
        level4: "LOW MATCH LIKELIHOOD",
        level5: "RECONFIRMATION REQUIRED"
      },
      scanning: "SCANNING FOR TARGETS...",
      verified: "VERIFIED PERSONNEL",
      modeCamera: "Live Camera",
      modeUpload: "Analyze Image",
      uploadLabel: "Upload Surveillance Image",
      similarity: "SIMILARITY",
      retake: "Retake Snapshot"
    },
    database: {
      title: "Biometric Database",
      records: "Records",
      empty: "No records found. Enroll a subject to begin.",
      export: "Export DB",
      import: "Import DB",
      importSuccess: "Database imported successfully!",
      importError: "Invalid backup file.",
      tabBiometric: "Biometric Data",
      tabPersonnel: "NK Key Figures",
      colName: "Name",
      colRole: "Role/Affiliation",
      colBirth: "Birth Date",
      colDeath: "Death Date",
      colAge: "Age",
      searchPlaceholder: "Search personnel list...",
      totalPersonnel: "Total Personnel",
      vectors: "Vectors",
      noImg: "No Img",
      deleteVector: "Delete this specific vector",
      noPersonnel: "No matching personnel found.",
      colAction: "Action",
      edit: "Edit",
      editTitle: "Edit Personnel Record",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      editStatus: "Status"
    },
    about: {
      title: "System Architecture",
      techHeader: "Technical Specifications",
      tech1Title: "Technique: Feature Extraction",
      tech1Desc: "Utilizes the SSD MobileNet V1 architecture, optimized for browser-based edge computing. It detects faces and maps facial landmarks to a unique 128-dimensional numerical vector (embedding) representing the geometric structure of the face.",
      tech2Title: "Technique: Euclidean Matching",
      tech2Desc: "Identification is performed using Euclidean distance metrics in a high-dimensional vector space. The system calculates the similarity between the live camera feed's vector and the encrypted vectors stored in the database. A distance threshold of 0.5 ensures high precision while minimizing false positives.",
      tech3Title: "Technique: Storage Structure & Privacy",
      tech3Desc: "Privacy-First Architecture: All biometric processing occurs locally within the user's browser (Client-Side). No images are ever uploaded to a server for recognition. The database stores only mathematical abstractions (hashes), making it impossible to reconstruct the original face image from the stored data.",
      diagram: `
                               [ WEB BROWSER CLIENT ]
                                         |
    +------------------------------------+---------------------------------------+
    |                                    |
[ React UI Layer ]                 [ Local AI Engine ]
    |                                    |
    |-- Camera Feed (HTML5)              |-- face-api.js (TensorFlow.js)
    |-- Canvas Overlay                   |     |-- SSD MobileNet (Detection)
    |-- State Management                 |     |-- FaceNet (Feature Extraction)
    |                                    |
    |                                    +-- Euclidean Distance Matcher
    |
    +-- Local Storage (IndexedDB/LS) <-------------------------------------------+
          |-- Encrypted Embeddings (Float32Array)
          |-- Metadata (Name, ID)

----------------------------------------------------------------------------------
                                   DATA FLOW
----------------------------------------------------------------------------------

1. ENROLLMENT (Local):
   Image Upload -> Detect Face -> Extract 128-D Vector -> Store in LocalStorage.

2. RECOGNITION (Local):
   Camera/Image -> Detect Face -> Extract Vector -> Compare w/ Stored Vectors -> Match %.
`
    },
    manual: {
      title: "Operation Manual",
      overviewTitle: "Operational Objective",
      overviewDesc: "SENTINEL_ID is a tactical biometric identification system developed to verify the identities of North Korean high-ranking officials and key figures. The primary objective is to enable rapid, on-site identification of subjects during surveillance operations or asset acquisition by cross-referencing live biometric data against a secured personnel database.",
      sec1Title: "1. Enrollment (Local)",
      sec1Desc: "Build your local biometric database. Upload photos of a subject to extract face vectors. These are stored locally in your browser and are used for matching in Identification mode.",
      sec2Title: "2. Identification (Live)",
      sec2Desc: "Perform real-time recognition using your device's camera or by uploading a static image. The system compares detected faces against both your enrolled subjects and the pre-loaded Personnel DB.",
      sec3Title: "3. Personnel DB Management",
      sec3Desc: "View and edit the list of North Korean Key Figures. You can modify personnel details or delete specific biometric vectors. Changes are persisted locally."
    },
    security: {
      title: "Security Notice",
      sec1Title: "1. Security & Purpose Disclaimer",
      sec1Desc: "This system is strictly designed for Open Source Intelligence (OSINT) demonstration purposes. It explicitly does NOT contain any classified military intelligence, sensitive government data, or non-public information.",
      sec2Title: "2. Data Source Attribution",
      sec2Desc: "The North Korean personnel data embedded in this system is derived exclusively from publicly available records provided by official institutions such as the Ministry of Unification (Information Portal on North Korea) and general media reports.",
      sec3Title: "3. Privacy-First Architecture",
      sec3Desc: "This application operates on a strict 'Client-Side Only' architecture. All facial recognition, vector extraction, and data matching processes occur entirely within the user's web browser. No facial images, biometric data, or usage logs are transmitted to external servers or the cloud, ensuring complete data sovereignty and operational security."
    }
  },
  ko: {
    nav: {
      title: "프로젝트 PID",
      enroll: "등록",
      identify: "식별",
      db: "인물 DB",
      settings: "설정",
      arch: "시스템 아키텍처",
      manual: "운용 메뉴얼",
      security: "보안 및 출처 고지",
      themeDark: "다크 모드",
      themeLight: "라이트 모드",
      langKo: "한글",
      langEn: "영어"
    },
    loading: {
      title: "시스템 초기화 중",
      desc: "신경망 모델 로딩 중..."
    },
    enroll: {
      title: "새 대상 등록",
      instruction: "대상의 사진을 한 장 이상 업로드하세요. 다양한 각도의 사진을 사용하면 정확도가 향상됩니다.",
      labelName: "대상 신원 (이름)",
      labelTitle: "소속 / 직책",
      labelGender: "성별",
      labelBirth: "출생연도/일자",
      labelAge: "나이",
      placeholderName: "전체 이름 입력...",
      placeholderTitle: "예: 선임 연구원",
      placeholderGender: "예: 남성/여성",
      placeholderBirth: "예: 1980년",
      placeholderAge: "자동 계산됨",
      quality: "얼굴 분석",
      optimal: "얼굴 감지됨",
      waiting: "업로드 대기 중...",
      save: "생체 데이터 저장",
      vectorLocked: "벡터_고정됨",
      errorName: "이름과 직책은 필수 입력 항목입니다.",
      errorFace: "업로드된 이미지에서 유효한 얼굴을 찾을 수 없습니다.",
      success: "인원이 성공적으로 등록되었습니다!",
      modeCamera: "카메라 촬영",
      modeUpload: "일괄 업로드",
      uploadLabel: "이미지 선택",
      uploadDesc: "여러 장 선택 가능 (JPG, PNG)",
      processing: "처리 중...",
      validCount: "{count}개의 유효한 얼굴"
    },
    recognize: {
      title: "실시간 식별",
      matchFound: "일치 항목 발견",
      noMatch: "미식별 대상",
      noMatchDesc: "데이터베이스에 일치하는 기록이 없습니다.",
      unknown: "미식별",
      analysisTitle: "인물 분석",
      confidence: "신뢰도",
      confidenceLevel: {
        level1: "일치 확률 높음",
        level2: "높은 일치 가능성",
        level3: "일치 가능성",
        level4: "낮은 일치 가능성",
        level5: "재확인 필요"
      },
      scanning: "목표 스캔 중...",
      verified: "신원 확인됨",
      modeCamera: "실시간 카메라",
      modeUpload: "이미지 분석",
      uploadLabel: "분석할 이미지 업로드",
      similarity: "일치율",
      retake: "다시 촬영"
    },
    database: {
      title: "생체 인식 데이터베이스",
      records: "기록",
      empty: "기록이 없습니다. 대상을 등록하여 시작하세요.",
      export: "DB 내보내기",
      import: "DB 가져오기",
      importSuccess: "데이터베이스를 성공적으로 불러왔습니다!",
      importError: "유효하지 않은 백업 파일입니다.",
      tabBiometric: "생체 데이터",
      tabPersonnel: "북한 주요인물",
      colName: "성명",
      colRole: "직책/소속",
      colBirth: "출생일",
      colDeath: "사망일",
      colAge: "나이",
      searchPlaceholder: "인명부 검색...",
      totalPersonnel: "총 인원",
      vectors: "개의 벡터",
      noImg: "이미지 없음",
      deleteVector: "이 벡터 삭제",
      noPersonnel: "일치하는 인원이 없습니다.",
      colAction: "편집",
      edit: "수정",
      editTitle: "인사 기록 수정",
      saveChanges: "변경사항 저장",
      cancel: "취소",
      editStatus: "사망 여부 (선택)"
    },
    about: {
      title: "시스템 아키텍처",
      techHeader: "기술적 특징",
      tech1Title: "기술: 특징 추출",
      tech1Desc: "브라우저 기반 엣지 컴퓨팅에 최적화된 SSD MobileNet V1 아키텍처를 사용합니다. 얼굴을 감지하고 랜드마크를 분석하여 얼굴의 기하학적 구조를 나타내는 고유한 128차원 수치 벡터(임베딩)로 변환합니다.",
      tech2Title: "기술: 유클리드 매칭",
      tech2Desc: "식별 과정은 고차원 벡터 공간에서의 유클리드 거리(Euclidean Distance) 측정을 통해 이루어집니다. 실시간 카메라 피드의 벡터와 데이터베이스에 저장된 암호화된 벡터 간의 유사도를 계산하며, 0.5의 거리 임계값을 적용하여 오탐지(False Positive)를 최소화하고 높은 정밀도를 보장합니다.",
      tech3Title: "기술: 저장 구조 및 효율성",
      tech3Desc: "프라이버시 중심 설계(Privacy-First): 모든 생체 인식 처리는 사용자의 브라우저(클라이언트 측) 내에서 로컬로 수행됩니다. 인식을 위해 이미지가 서버로 전송되지 않으며, 데이터베이스는 수학적 추상화(해시) 값만을 저장하므로 저장된 데이터로부터 원본 얼굴 이미지를 복원하는 것은 불가능합니다.",
      diagram: `
                               [ 웹 브라우저 클라이언트 ]
                                         |
    +------------------------------------+---------------------------------------+
    |                                    |
[ React UI 레이어 ]                 [ 로컬 AI 엔진 ]
    |                                    |
    |-- 카메라 피드 (HTML5)              |-- face-api.js (TensorFlow.js)
    |-- 캔버스 오버레이                  |     |-- SSD MobileNet (감지)
    |-- 상태 관리                        |     |-- FaceNet (특징 추출)
    |                                    |
    |                                    +-- 유클리드 거리 매칭
    |
    +-- 로컬 스토리지 (IndexedDB/LS) <-------------------------------------------+
          |-- 암호화된 임베딩 (Float32Array)
          |-- 메타데이터 (이름, ID)

----------------------------------------------------------------------------------
                                   데이터 흐름
----------------------------------------------------------------------------------

1. 등록 (Enrollment - 로컬):
   이미지 업로드 -> 얼굴 감지 -> 128-D 벡터 추출 -> 로컬 스토리지 저장.

2. 식별 (Recognition - 로컬):
   카메라/이미지 -> 얼굴 감지 -> 벡터 추출 -> 저장된 벡터와 비교 -> 일치율(%) 계산.
`
    },
    manual: {
      title: "운용 메뉴얼",
      overviewTitle: "시스템 개요 및 제작 목적",
      overviewDesc: "SENTINEL_ID는 북한 고위급 인사 및 주요 요인에 대한 신속하고 정확한 신원 식별을 위해 개발된 전술 생체 인식 시스템입니다. 본 시스템은 작전 중 확보된 신병이나 감시 자산을 통해 획득한 대상의 안면 데이터를 분석하고, 기 구축된 북한 주요 인물 데이터베이스와 대조하여 피아 식별 및 대상의 정확한 신원을 확정하는 것을 주 목적으로 합니다.",
      sec1Title: "1. 등록 (Enrollment)",
      sec1Desc: "로컬 생체 데이터베이스를 구축하는 모드입니다. 대상의 사진을 업로드하면 얼굴을 자동 감지하고 고유 특징(벡터)을 추출하여 브라우저에 안전하게 저장합니다. 저장된 데이터는 서버로 전송되지 않습니다.",
      sec2Title: "2. 식별 (Identification)",
      sec2Desc: "실시간 인식 모드입니다. PC/모바일의 '카메라'를 이용해 실시간 피드를 분석하거나, '이미지 업로드'를 통해 CCTV 캡처 등의 정지 영상을 분석하여 DB와 대조합니다.",
      sec3Title: "3. 인물 DB 관리",
      sec3Desc: "등록된 생체 데이터와 탑재된 북한 주요 인물 목록을 열람하고 관리합니다. 인물의 상세 정보를 수정하거나 오인식된 벡터를 개별적으로 삭제할 수 있습니다. (현재 김정은을 포함한 15명에 대한 227개의 공개 사진에 대한 벡터화한 데이터가 포함되어 있습니다. / '26.2.19일 기준)"
    },
    security: {
      title: "보안 및 출처 고지",
      sec1Title: "1. 보안 개요 및 목적",
      sec1Desc: "본 시스템은 공개출처정보(OSINT) 활용 시연을 목적으로 제작되었습니다. 어떠한 군사 기밀이나 비공개 첩보 자료도 포함하고 있지 않음을 명확히 고지합니다.",
      sec2Title: "2. 데이터 출처",
      sec2Desc: "탑재된 북한 주요 인물 데이터는 대한민국 통일부의 '북한정보포털' 등 공식 기관에서 공개한 자료와 언론 보도 사진을 기반으로 구축되었습니다.",
      sec3Title: "3. 아키텍처 보안 강점",
      sec3Desc: "본 앱은 'Privacy-First(프라이버시 우선)' 아키텍처를 채택하여, 모든 안면 인식 및 벡터 추출 과정이 사용자의 브라우저(클라이언트) 내부에서만 독립적으로 수행됩니다. 어떠한 이미지나 생체 데이터도 외부 서버나 클라우드로 전송되지 않아 데이터 유출 위협으로부터 안전합니다."
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];