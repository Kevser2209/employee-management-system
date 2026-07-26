# Employee Leave & Overtime Management System

Personel izin ve fazla mesai taleplerinin oluşturulması, onaylanması ve takip edilmesini sağlayan full-stack web uygulaması.

## Özellikler

- JWT tabanlı kimlik doğrulama ve rol bazlı yetkilendirme (Admin, HR, Manager, Employee)
- Departman ve çalışan yönetimi
- İzin türleri, bakiye takibi ve talep/onay akışı
- Fazla mesai talebi oluşturma ve onay süreci
- React tabanlı modern kullanıcı arayüzü

## Teknoloji Yığını

| Katman   | Teknolojiler                                      |
| -------- | ------------------------------------------------- |
| Backend  | Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic |
| Auth     | JWT, Passlib (bcrypt)                             |
| Frontend | React, Tailwind CSS                               |

## Proje Yapısı

```
employee-management-system/
├── backend/
│   ├── app/
│   │   ├── api/          # HTTP route katmanı
│   │   ├── core/         # Yapılandırma, güvenlik, bağımlılıklar
│   │   ├── models/       # SQLAlchemy veritabanı modelleri
│   │   ├── schemas/      # Pydantic request/response şemaları
│   │   └── services/     # İş mantığı katmanı
│   ├── alembic/          # Veritabanı migration'ları
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/          # HTTP istemcisi
│   │   ├── components/   # Yeniden kullanılabilir UI bileşenleri
│   │   ├── context/      # Global state (auth vb.)
│   │   ├── hooks/        # Özel React hook'ları
│   │   └── pages/        # Sayfa bileşenleri
│   └── .env.example
└── README.md
```

## Gereksinimler

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

## Kurulum

### 1. Depoyu klonlayın

```bash
git clone <repo-url>
cd employee-management-system
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # Değerleri düzenleyin
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env       # Değerleri düzenleyin
```

## Geliştirme Durumu

Proje aşamalı olarak geliştirilmektedir.

| Aşama | Durum        | Açıklama                          |
| ----- | ------------ | --------------------------------- |
| 1     | Tamamlandı   | Proje altyapısı ve dokümantasyon  |
| 2     | Bekliyor     | Backend temel kurulum             |
| 3     | Bekliyor     | Veritabanı bağlantısı             |
| ...   | Bekliyor     | Diğer modüller                    |

## Lisans

Bu proje portföy amaçlı geliştirilmektedir.
