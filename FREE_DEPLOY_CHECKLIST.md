# Тегін әрі тиімді deploy checklist

Бұл жоба үшін ең тиімді тегін жол:

1. GitHub репозиторий
2. Vercel тегін hosting
3. Supabase тегін database және фото сақтау
4. Vercel тегін subdomain

## 1. GitHub

1. https://github.com сайтына кіріңіз.
2. Жаңа repository ашыңыз.
3. Жоба кодын сол repository-ге жүктеңіз.

Егер GitHub Desktop қолдансаңыз, осы папканы таңдаңыз:

```text
C:\Users\Asus\Documents\Nauat Project 2.0
```

## 2. Supabase

1. https://supabase.com сайтына кіріңіз.
2. Тегін project ашыңыз.
3. SQL Editor бөліміне кіріңіз.
4. `supabase-schema.sql` файлының ішін толық көшіріп, Run басыңыз.
5. Project Settings -> API бөлімінен мына мәндерді алыңыз:
   - Project URL
   - service_role key

Бұл мәндерді ешкімге жариялауға болмайды.

## 3. Vercel

1. https://vercel.com сайтына кіріңіз.
2. GitHub арқылы кіріңіз.
3. Add New -> Project басыңыз.
4. GitHub-тағы Nauat repository-ді таңдаңыз.
5. Environment Variables бөліміне мына мәндерді қойыңыз:

```text
ADMIN_USER=admin
ADMIN_PASSWORD=өзіңіз-ойлаған-күшті-құпиясөз
NEXT_PUBLIC_SITE_URL=https://сіздің-жобаңыз.vercel.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_BUCKET=nauat-assets
```

6. Deploy басыңыз.
7. Deploy біткен соң Vercel берген сілтемені ашыңыз.

## 4. QR

Deploy болғаннан кейін:

1. Vercel сілтемесі арқылы `/admin` ішіне кіріңіз.
2. Heritage объектілерін ашыңыз.
3. QR PNG/PDF файлдарын қайта жүктеңіз.
4. Басып шығарылатын QR кодтар дәл production сілтемесіне апарады.

## 5. Қонақтарға берер алдында

- Админ құпиясөзін ауыстырыңыз.
- Нақты фото жүктеңіз.
- Нақты тарихи мәтіндерді тексеріңіз.
- Телефоннан сайтты тексеріңіз.
- QR кодты сканерлеп тексеріңіз.
- Брондау өтінімі админ бетіне түсетінін тексеріңіз.

## 6. Тегін тариф шектеуі

- Vercel subdomain тегін.
- Supabase тегін лимиті MVP үшін жеткілікті.
- Көп фото немесе көп трафик болса, кейін ақылы тариф қажет болуы мүмкін.
- `.kz` сияқты жеке домен әдетте ақылы.
