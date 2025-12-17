
import { BookOpen, UserCheck, Target, Users, Search, Leaf, TrendingUp, Zap, Radio, BarChart3, LineChart } from "lucide-react";

// --- Analysis Constants & Types ---

export const REFLECTION_LEVELS = {
    BERKEMBANG: "Berkembang",
    BERDAYA: "Berdaya"
};

export const CAPACITY_LEVELS = {
    RENDAH: "Rendah",
    SEDANG: "Sedang",
    TINGGI: "Tinggi"
};

export const STRATEGIES = {
    PENYEMAI: {
        id: "Penyemai Perubahan",
        title: "Penyemai Perubahan",
        description: "Strategi difokuskan pada menumbuhkan kesadaran dan keyakinan akan pentingnya perubahan.",
        icon: Leaf,
        color: "rose",
        priority: "Prioritas Utama",
        sasaran: "Satuan pendidikan dengan kapasitas rendah dan kesadaran berkembang.",
        kebutuhan: "Kepala sekolah belum menyadari pentingnya refleksi dalam melakukan perencanaan dan pelaksanaan program kerja."
    },
    PENGUATAN: {
        id: "Penguatan Perubahan",
        title: "Penguatan Perubahan",
        description: "Strategi difokuskan pada penguatan kompetensi teknis dan manajerial dalam memimpin perubahan.",
        icon: TrendingUp,
        color: "amber",
        priority: "Prioritas Menengah",
        sasaran: "Satuan pendidikan dengan kapasitas sedang dan kesadaran berkembang.",
        kebutuhan: "Program kerja sekolah cenderung masih monoton dan belum banyak perubahan dari tahun ke tahun."
    },
    PEMICU: {
        id: "Pemicu Perubahan",
        title: "Pemicu Perubahan",
        description: "Strategi difokuskan pada mendorong inisiatif perubahan yang lebih luas dan berdampak.",
        icon: Zap,
        color: "amber",
        priority: "Prioritas Menengah", // Changed from Prioritas Akhir
        sasaran: "Satuan pendidikan dengan kapasitas tinggi dan kesadaran berkembang.",
        kebutuhan: "Perlu memberi arahan kepada kepala sekolah untuk mereplikasi program Satuan Pendidikan lain yang telah terbukti berhasil."
    },
    SEGERA: {
        id: "Perubahan Segera",
        title: "Perubahan Segera",
        description: "Fokus pada intervensi cepat untuk mengatasi hambatan mendasar dalam perubahan.",
        icon: Radio,
        color: "amber",
        priority: "Prioritas Menengah",
        sasaran: "Satuan pendidikan dengan kapasitas rendah dan kesadaran berdaya.",
        kebutuhan: "Program kerja sekolah pada tahun terakhir sudah menunjukkan adanya perubahan, namun belum berdampak nyata karena mengabaikan basis data akurat."
    },
    BERANGSUR: {
        id: "Perubahan Berangsur",
        title: "Perubahan Berangsur",
        description: "Pendampingan dilakukan secara bertahap untuk memastikan keberlanjutan perubahan.",
        icon: BarChart3,
        color: "amber",
        priority: "Prioritas Menengah",
        sasaran: "Satuan pendidikan dengan kapasitas sedang dan kesadaran berdaya.",
        kebutuhan: "Komitmen perubahan sudah bertumbuh, namun belum konsisten dengan visi perubahan."
    },
    BERKELANJUTAN: {
        id: "Perubahan Berkelanjutan",
        title: "Perubahan Berkelanjutan",
        description: "Fokus pada menjaga momentum dan memperluas dampak perubahan yang sudah terjadi.",
        icon: LineChart,
        color: "emerald",
        priority: "Prioritas Akhir",
        sasaran: "Satuan pendidikan dengan kapasitas tinggi dan kesadaran berdaya.",
        kebutuhan: "Komitmen perubahan kedua sekolah amat terlihat, namun dampaknya masih terkonsentrasi pada warga sekolah."
    }
};

export const METHOD_OPTIONS = [
    {
        id: "training",
        title: "Training",
        icon: BookOpen,
        label: "Training & Konsultasi", // As per image example somewhat
        luaran: "Terjadi peningkatan pada kapasitas memimpin perubahan."
    },
    {
        id: "mentoring",
        title: "Mentoring",
        icon: UserCheck,
        label: "Training & Mentoring",
        luaran: "Hasil pelatihan yang dilakukan diterapkan dan menjadi kebiasaan baru."
    },
    {
        id: "coaching",
        title: "Coaching",
        icon: Target,
        label: "Coaching",
        luaran: "Kepala sekolah diberdayakan menjadi simpul inspirasi pada komunitas belajar."
    },
    {
        id: "facilitating",
        title: "Facilitating",
        icon: Users,
        label: "Fasilitasi",
        luaran: "Seluruh kegiatan dalam RKT dan RKAS terlaksana dan menciptakan dampak langsung."
    },
    {
        id: "consulting",
        title: "Consulting",
        icon: Search,
        label: "Konsultasi",
        luaran: "Sebagian kegiatan yang disusun dalam Rencana Kerja Tahunan (RKT) berhasil terlaksana."
    }
];

// --- Helper Functions ---

export const getStrategy = (reflection: string, capacity: string) => {
    if (reflection === REFLECTION_LEVELS.BERKEMBANG) {
        if (capacity === CAPACITY_LEVELS.RENDAH) return STRATEGIES.PENYEMAI;
        if (capacity === CAPACITY_LEVELS.SEDANG) return STRATEGIES.PENGUATAN;
        return STRATEGIES.PEMICU;
    } else {
        if (capacity === CAPACITY_LEVELS.RENDAH) return STRATEGIES.SEGERA;
        if (capacity === CAPACITY_LEVELS.SEDANG) return STRATEGIES.BERANGSUR;
        return STRATEGIES.BERKELANJUTAN;
    }
};

export const calculateLevels = (answers: Record<string, string>) => {
    // Default safe return
    if (!answers) return { reflectionLevel: REFLECTION_LEVELS.BERKEMBANG, capacityLevel: CAPACITY_LEVELS.RENDAH };

    const rScores = [];
    if (answers["q1_1"]) rScores.push(["k1", "k2"].includes(answers["q1_1"]) ? 1 : 2);
    if (answers["q1_2"]) rScores.push(["k1", "k2"].includes(answers["q1_2"]) ? 1 : 2);

    const rAvg = rScores.length > 0 ? rScores.reduce((a, b) => a + b, 0) / rScores.length : 1;
    const reflectionLevel = rAvg >= 1.5 ? REFLECTION_LEVELS.BERDAYA : REFLECTION_LEVELS.BERKEMBANG;

    const cScores = [];
    const getCScore = (ans: string) => {
        if (["c1", "c2"].includes(ans)) return 1;
        if (["c3", "c4"].includes(ans)) return 2;
        if (["c5", "c6"].includes(ans)) return 3;
        return 1;
    };
    if (answers["q2_1"]) cScores.push(getCScore(answers["q2_1"]));
    if (answers["q2_2"]) cScores.push(getCScore(answers["q2_2"]));

    const cAvg = cScores.length > 0 ? cScores.reduce((a, b) => a + b, 0) / cScores.length : 1;
    let capacityLevel = CAPACITY_LEVELS.RENDAH;
    if (cAvg >= 1.5 && cAvg < 2.5) capacityLevel = CAPACITY_LEVELS.SEDANG;
    if (cAvg >= 2.5) capacityLevel = CAPACITY_LEVELS.TINGGI;

    return { reflectionLevel, capacityLevel };
};
