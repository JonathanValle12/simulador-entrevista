export const STACK_GROUPS_BY_ROLE: Record<string, { label: string; items: string[] }[]> = {
    "Frontend Developer": [
        {
            label: "Frontend",
            items: [
                "HTML/CSS",
                "JavaScript", "TypeScript",
                "React", "Vue.js", "Angular", "Svelte", "SolidJS", "Preact", "Lit", "Alpine.js", "Qwik",
                "Next.js", "Nuxt.js", "SvelteKit", "Remix", "Astro",
                "Tailwind CSS", "SASS/SCSS", "Redux", "Vite", "Webpack"
            ]
        }
    ],
    "Backend Developer": [
        {
            label: "Backend",
            items: [
                "Node.js", "TypeScript", "Express", "NestJS", "Java", "Spring Boot",
                "C#", "ASP.NET", "Python", "Django", "Flask", "FastAPI", "Go", "Ruby on Rails",
                "PHP", "Laravel", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker"
            ]
        }
    ],
    "Full Stack Developer": [
        {
            label: "Frontend",
            items: [
                "React", "Vue.js", "Angular", "Svelte",
                "Next.js", "Nuxt.js",
                "TypeScript",
                "Tailwind CSS", "SASS/SCSS", "Redux",
                "Vite", "Webpack"
            ]
        },
        {
            label: "Backend",
            items: [
                "Node.js", "TypeScript", "Express", "NestJS", "Java", "Spring Boot",
                "C#", "ASP.NET", "Python", "Django", "Flask", "FastAPI", "Go", "Ruby on Rails",
                "PHP", "Lalabel", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker"
            ]
        }
    ],
    "Mobile Developer": [
        {
            label: "Mobile",
            items: [
                "React Native", "Expo", "Flutter", "Ionic", "Capacitor", "Xamarin", ".NET MAUI", "NativeScript", "Kotlin Multiplatform Mobile",
                "Cordova", "Kotlin", "Java", "Jetpack Compose", "Android SDK", "Room", "Retrofit", "Hilt/Dagger", "Swift", "SwiftUI", "Objective-C",
                "Combine", "Alamofire", "CoreData", "Android Studio", "Xcode", "Firebase", "Realm", "SQLite"
            ]
        }
    ],
    "DevOps Engineer": [
        {
            label: "DevOps",
            items: [
                "AWS", "Azure", "GPC", "Docker", "Kubernetes", "Terraform", "Ansible", "Helm", "Jenkins", "GitHub Actions",
                "Argo CD", "Nginx", "Prometheus", "Grafana", "Linux"
            ]
        }
    ],
    "Data Engineer": [
        {
            label: "Data",
            items: [
                "Python", "SQL", "Scala", "Java",
                "Apache Spark", "Apache Flink", "Hadoop",
                "Kafka", "Elasticsearch", "Pandas", "NumPy", "Airflow", "Snowflake"
            ]
        }
    ]
}