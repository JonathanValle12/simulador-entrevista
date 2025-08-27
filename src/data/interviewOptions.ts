import { type ConfigType } from "@/types/interview";

export const ROLES = [
    { key: "Frontend Developer", label: "Frontend Developer", description: "React, Vue, Angular, CSS", emoji: "🎨" },
    { key: "Backend Developer", label: "Backend Developer", description: "Node.js, Python, Java, APIs", emoji: "⚙️" },
    { key: "Full Stack Developer", label: "Full-Stack Developer", description: "Frontend + Backend", emoji: "🧩" },
    { key: "Mobile Developer", label: "Mobile Developer", description: "React Native, Flutter, iOS, Android", emoji: "📱" },
    { key: "DevOps Engineer", label: "DevOps Engineer", description: "AWS, Docker, Kubernetes, CI/CD", emoji: "🚀" },
    { key: "Data Engineer", label: "Data Engineer", description: "Python, SQL, ETL, Big Data", emoji: "📊" },
] as const;

export const TYPES: { key: ConfigType; label: string; description: string; disableWhenJunior?: boolean }[] = [
    { key: "Técnica", label: "Técnica", description: "Algoritmos, estructuras de datos, coding" },
    { key: "Comportamental", label: "Comportamental", description: "Experiencias, situaciones, soft skills" },
    { key: "Diseño de Sistemas", label: "Diseño de Sistemas", description: "Arquitectura, escalabilidad, trade-offs", disableWhenJunior: true },
    { key: "Mixta", label: "Mixta", description: "Combinación de técnica y comportamental" },
];
