# 🌾 Krishi Sahayog

**AI-Powered Crop & Disease Advisory Platform for Nepali Farmers**

Krishi Sahayog ("Agriculture Support") is a full-stack, cloud-native web application that helps farmers in Nepal make informed farming decisions through AI-driven crop recommendations and plant disease detection.

---

## 📌 Problem Statement

Nepal's economy is heavily agriculture-dependent, yet most farmers — especially in rural and hilly districts — lack access to:

- Agricultural extension officers or timely expert advice
- Information on which crops suit their soil, climate, and season
- Early detection of plant diseases before crops are damaged
- A centralized digital record of their farming history

Krishi Sahayog bridges this gap with a simple, accessible digital tool that puts an AI advisor in every farmer's hands.

---

## ✨ Features

- 🔐 **User Authentication** — Secure signup/login for farmers
- 🌱 **Crop Recommendation** — AI-suggested crops based on soil type, district, and season
- 🍃 **Disease Detection** — Upload a leaf photo to detect plant disease and get treatment suggestions
- 📊 **Farmer Dashboard** — View past predictions and crop history
- 🌐 **Multilingual Support** *(planned)* — Nepali + English UI

---

## 🏗️ System Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend    │ ───▶ │   Backend     │ ───▶ │  Database     │
│  (React, in   │ ◀─── │  (Flask API,  │ ◀─── │ (PostgreSQL,  │
│  Docker pod)  │      │  in Docker    │      │  in Docker    │
│               │      │  pod + AI     │      │  pod, w/ PVC) │
└──────────────┘      └──────┬───────┘      └──────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Cloudinary        │
                    │ (image storage)    │
                    └──────────────────┘

     All services orchestrated via Kubernetes (Minikube)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, Axios, React Router |
| **Backend** | Flask (Python), SQLAlchemy, Flask-JWT-Extended |
| **Database** | PostgreSQL |
| **AI/ML** | TensorFlow/Keras (disease detection CNN), scikit-learn (crop recommendation) |
| **Image Storage** | Cloudinary |
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (Minikube), kubectl |
| **Cloud Hosting (demo)** | Render / Railway (backend), Vercel (frontend) |
| **Testing** | Postman, Pytest, Jest |
| **Version Control** | Git, GitHub |

---

## 📂 Project Structure

```
krishi-sahayog/
├── backend/
│   ├── app.py
│   ├── models/            # SQLAlchemy DB models
│   ├── routes/             # API route blueprints
│   ├── ml_models/          # Trained model files (.h5 / .pkl)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── k8s/
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   └── postgres-pvc.yaml
├── docker-compose.yaml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Minikube](https://minikube.sigs.k8s.io/) & [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Node.js (v18+) & Python (3.11+) — for local dev without containers

### Local Development (Docker Compose)

```bash
# Clone the repository
git clone https://github.com/<your-username>/krishi-sahayog.git
cd krishi-sahayog

# Start all services
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Kubernetes Deployment (Minikube)

```bash
# Start Minikube
minikube start

# Apply all manifests
kubectl apply -f k8s/

# Check pod status
kubectl get pods

# Access the frontend service
minikube service frontend-service
```

### Scaling Demo

```bash
kubectl scale deployment backend-deployment --replicas=4
kubectl get pods
```

---

## 🤖 AI Models

| Model | Purpose | Framework | Dataset |
|---|---|---|---|
| Disease Detection CNN | Classify plant disease from leaf image | TensorFlow/Keras | PlantVillage Dataset |
| Crop Recommendation | Suggest suitable crops based on soil/season/district | scikit-learn | Crop Recommendation Dataset (adapted for Nepal) |

---

## 👥 Team & Roles

| Role | Responsibilities |
|---|---|
| **Frontend Developer** | UI/UX, React components, API integration |
| **Backend Developer** | Flask REST API, authentication, DB integration |
| **AI/ML Engineer** | Model training, evaluation, integration into backend |
| **DevOps/Cloud Engineer** | Docker, Kubernetes manifests, deployment |
| **QA/Docs Lead** | Testing, documentation, presentation |

---

## 📈 Future Improvements

- SMS-based access for farmers without smartphones
- Offline-first mobile app (PWA)
- Weather API integration for real-time advisory
- Expanded disease dataset with Nepal-specific crops

---

## 📄 License

This project is developed for academic purposes as part of a first-year college final project.

---

## 🙏 Acknowledgements

- [PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease)
- Kaggle Crop Recommendation Dataset
- Open-source communities behind React, Flask, and Kubernetes
