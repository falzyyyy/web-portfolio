import { FaGithub, FaHtml5, FaVideo, FaPalette } from "react-icons/fa";
import {
  SiJavascript,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiGooglecloud,
  SiFigma,
} from "react-icons/si";
import type { IconType } from "react-icons";

/* ── Types ── */
export interface Experience {
  year: string;
  title: string;
  organization: string;
  description: string;
}

export interface HardSkill {
  name: string;
  icon: IconType;
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface Documentation {
  id: string;
  title: string;
  category: "Organization" | "Project" | "University";
  imageUrl: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon: IconType;
}

/* ── Hero ── */
export const heroData = {
  name: "Naufal Nazhif Almaulidzar",
  roles: ["IT Professional", "Software Engineer", "Public Relations"],
  tagline: "Fresh Graduate of Informatics Engineering, University of Sriwijaya. Passionate about technology, communication, and creating impactful solutions.",
  resumeUrl: "/resume.pdf",
};

/* ── About ── */
export const aboutData = {
  paragraphs: [
    "My name is Naufal Nazhif Almaulidzar, a fresh graduate of Informatics Engineering from the Faculty of Computer Science, University of Sriwijaya. I am passionate about exploring technology and communication, particularly in IT solutions, Public Relations, and event management.",
    "With a strong interest in fostering meaningful connections and impactful teamwork, I aim to leverage my technical skills and organizational experience to contribute to innovative projects and collaborative environments."
  ],
};

/* ── Experiences ── */
export const experiences: Experience[] = [
  {
    year: "Jan 2025 — Present",
    title: "Public Relation Member",
    organization: "GDGoC Chapter Sriwijaya University",
    description:
      "Managing external communications and promotional campaigns across social media to increase event visibility. Served as PR committee for Google APAC Solution Challenge Info Session and Vice Project Officer for InspireHER.",
  },
  {
    year: "Jan 2025 — Present",
    title: "Inspectorate General",
    organization: "BEM KM FASILKOM UNSRI",
    description:
      "Conducting regular audits and evaluations of BEM departments to ensure compliance with internal policies, maintaining a high standard of transparency and accountability.",
  },
  {
    year: "Jan 2025 — Present",
    title: "Vice Chairman",
    organization: "ILKOM SPORT UNSRI",
    description:
      "Assisting the Chairman in leading sports-related programs, supervising event coordination, and developing strategic plans to expand the impact of sports activities.",
  },
  {
    year: "Sep 2024 — Jan 2025",
    title: "Cloud Computing Cohort",
    organization: "Bangkit Academy by Google, Tokopedia, Gojek, & Traveloka",
    description:
      "Specialized in cloud infrastructure, deployment pipelines, and scalable architecture design using Google Cloud technologies for a real-world capstone project.",
  },
  {
    year: "Jul 2024 — Aug 2024",
    title: "Fullstack Web Developer Intern",
    organization: "Rumah Sakit Dr. Mohammad Hoesin (RSMH)",
    description:
      "Developed an online attendance web application for employees. Designed user-friendly UI with HTML/CSS/JS and built robust backend using Laravel, PHP, and MySQL.",
  },
  {
    year: "Feb 2024 — Dec 2024",
    title: "Deputy of Sports and Talent Development",
    organization: "Himpunan Mahasiswa Informatika UNSRI (HMIF)",
    description:
      "Led initiatives to enhance student participation in sports and talent programs. Acted as PIC for Srifoton 2024 Exhibition, managing logistics and internal teams.",
  },
];

/* ── Education ── */
export const educations: Experience[] = [
  {
    year: "2022 — Present",
    title: "Bachelor of Computer Science – Informatics",
    organization: "Sriwijaya University, Palembang",
    description:
      "Current GPA: 3.84/4.00. Actively involved in various student organizations, event management, and technical study groups like GDGoC and Bangkit Academy.",
  },
  {
    year: "Jul 2019 — Jun 2022",
    title: "High School Diploma",
    organization: "SMA IT Bina Ilmi Palembang",
    description:
      "Graduated with an outstanding grade of 96.41. Developed foundational skills in communication and leadership.",
  },
];

/* ── Skills ── */
export const hardSkills: HardSkill[] = [
  { name: "HTML & CSS", icon: FaHtml5 },
  { name: "JavaScript", icon: SiJavascript },
  { name: "PHP & Laravel", icon: SiLaravel },
  { name: "MySQL", icon: SiMysql },
  { name: "Google Cloud", icon: SiGooglecloud },
  { name: "Figma", icon: SiFigma },
  { name: "Adobe Creative Suite", icon: FaPalette },
  { name: "Video Editing", icon: FaVideo },
];

export const softSkills: string[] = [
  "Event Management & Public Speaking",
  "Communication & Interpersonal Skills",
  "Leadership & Teamwork",
  "Time Management",
  "Adaptability & Problem Solving",
];

/* ── Projects ── */
export const projects: Project[] = [
  {
    title: "RSMH Online Attendance App",
    description:
      "A full-stack web application developed during internship to manage employee attendance efficiently with a user-friendly interface.",
    techStack: ["Laravel", "PHP", "MySQL", "JavaScript", "Bootstrap"],
    githubUrl: "#",
    liveUrl: "https://rsmh.co.id", // example, assuming it has a live link
  },
  {
    title: "Cloud Architecture Capstone",
    description:
      "Scalable cloud infrastructure and deployment pipeline designed to solve real-world problems as part of the Bangkit Academy final project.",
    techStack: ["Google Cloud", "Docker", "Node.js", "CI/CD"],
    githubUrl: "#",
  },
  {
    title: "InspireHER: Be Limitless",
    description:
      "Managed logistics, timeline, and PR strategy as Vice Project Officer for a women-empowerment initiative led by GDGoC Sriwijaya University.",
    techStack: ["Event Management", "Public Relations", "Leadership"],
    liveUrl: "https://gdg.community.dev/", // example
  },
  {
    title: "FASILKOM E-Sport Competition",
    description:
      "Led a team of 15 members to organize a successful university-level e-sports competition for over 100 participants.",
    techStack: ["Project Management", "Budgeting", "Sponsorship"],
  },
];

/* ── Documentations ── */
export const documentations: Documentation[] = [
  {
    id: "org-1",
    title: "BEM KM FASILKOM Event",
    category: "Organization",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "univ-1",
    title: "Bangkit Academy Graduation",
    category: "University",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "org-2",
    title: "GDGoC Solution Challenge Info Session",
    category: "Organization",
    imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "proj-1",
    title: "RSMH Intern App Deployment",
    category: "Project",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "univ-2",
    title: "Srifoton 2024 Exhibition",
    category: "University",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "proj-2",
    title: "Cloud Capstone Architecture Meeting",
    category: "Project",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
  },
];

/* ── Social Links ── */
export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    url: "https://github.com/",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/",
    icon: FaGithub, 
  },
  {
    label: "Email",
    url: "mailto:naufalnazhif3@gmail.com",
    icon: FaGithub, 
  },
];
