-- 홈 CMS: 학교 소개·비전 문구 갱신

update public.site_page_contents
set payload = payload
  || jsonb_build_object(
    'about.body', '도담도담한글학교는 유아부터 성인까지 한국어와 한국 문화·역사를 배우고 싶은 모든 학생을 위한 학교입니다. 한국어 교육과 문화·역사 교육, 정서 코칭과 바른 인성교육을 통해 건강한 성장을 함께합니다.',
    'vision.lead', '한국어와 한국 문화를 통해 정체성을 키우고, 바른 인성과 공동체 의식을 갖춘 세계시민으로 함께 성장합니다.',
    'hero.cta', '학교 소개 보기'
  ),
  updated_at = now()
where page_slug = 'home'
  and locale = 'ko';

update public.site_page_contents
set payload = payload
  || jsonb_build_object(
    'about.body', 'Dodamdodam Korean Language School welcomes every student—from young children to adults—who wants to learn Korean language, culture, and history. Through Korean language education, culture and history learning, emotional coaching, and character education, we grow together in a healthy way.',
    'vision.lead', 'Through Korean language and culture, we nurture identity and grow together as global citizens with sound character and a sense of community.',
    'hero.cta', 'About the school'
  ),
  updated_at = now()
where page_slug = 'home'
  and locale = 'en';

update public.site_page_contents
set payload = payload
  || jsonb_build_object(
    'about.body', 'Die Dodamdodam Koreanische Schule ist für alle Schülerinnen und Schüler – vom Kindes- bis zum Erwachsenenalter – da, die Koreanisch sowie koreanische Kultur und Geschichte lernen möchten. Mit Sprach-, Kultur- und Geschichtsunterricht sowie emotionaler Begleitung und Werteerziehung wachsen wir gemeinsam gesund.',
    'vision.lead', 'Durch koreanische Sprache und Kultur stärken wir Identität und wachsen gemeinsam zu Weltbürgerinnen und Weltbürgern mit Charakter und Gemeinschaftssinn.',
    'hero.cta', 'Zur Schulvorstellung'
  ),
  updated_at = now()
where page_slug = 'home'
  and locale = 'de';
