export enum MedicalSpecialty {
  ALERGOLOGIA = "Alergologia",
  ANESTESIOLOGIA = "Anestesiologia",
  ANGIOLOGIA = "Angiologia",
  CANCEROLOGIA = "Cancerologia",
  CARDIOLOGIA = "Cardiologia",
  CIRURGIA_CARDIOVASCULAR = "Cirurgia Cardiovascular",
  CIRURGIA_CABECA_PESCOCO = "Cirurgia de Cabeça e Pescoço",
  CIRURGIA_DIGESTIVA = "Cirurgia do Aparelho Digestivo",
  CIRURGIA_GERAL = "Cirurgia Geral",
  CIRURGIA_PEDIATRICA = "Cirurgia Pediátrica",
  CIRURGIA_PLASTICA = "Cirurgia Plástica",
  CIRURGIA_TORACICA = "Cirurgia Torácica",
  CIRURGIA_VASCULAR = "Cirurgia Vascular",
  CLINICA_MEDICA = "Clínica Médica",
  DERMATOLOGIA = "Dermatologia",
  ENDOCRINOLOGIA = "Endocrinologia e Metabologia",
  ENDOSCOPIA = "Endoscopia",
  GASTROENTEROLOGIA = "Gastroenterologia",
  GERIATRIA = "Geriatria",
  GINECOLOGIA_OBSTETRICIA = "Ginecologia e Obstetrícia",
  HEMATOLOGIA = "Hematologia e Hemoterapia",
  HEPATOLOGIA = "Hepatologia",
  HOMEOPATIA = "Homeopatia",
  INFECTOLOGIA = "Infectologia",
  MASTOLOGIA = "Mastologia",
  MEDICINA_DE_EMERGENCIA = "Medicina de Emergência",
  MEDICINA_DO_ESPORTO = "Medicina do Esporte",
  MEDICINA_DO_TRABALHO = "Medicina do Trabalho",
  MEDICINA_DE_FAMILIA = "Medicina de Família e Comunidade",
  MEDICINA_FISICA_REABILITACAO = "Medicina Física e Reabilitação",
  MEDICINA_INTENSIVA = "Medicina Intensiva",
  MEDICINA_LEGAL = "Medicina Legal e Perícia Médica",
  NEFROLOGIA = "Nefrologia",
  NEUROCIRURGIA = "Neurocirurgia",
  NEUROLOGIA = "Neurologia",
  NUTROLOGIA = "Nutrologia",
  OFTALMOLOGIA = "Oftalmologia",
  ONCOLOGIA_CLINICA = "Oncologia Clínica",
  ORTOPEDIA_TRAUMATOLOGIA = "Ortopedia e Traumatologia",
  OTORRINOLARINGOLOGIA = "Otorrinolaringologia",
  PATOLOGIA = "Patologia",
  PATOLOGIA_CLINICA = "Patologia Clínica/Medicina Laboratorial",
  PEDIATRIA = "Pediatria",
  PNEUMOLOGIA = "Pneumologia",
  PSIQUIATRIA = "Psiquiatria",
  RADIOLOGIA = "Radiologia e Diagnóstico por Imagem",
  RADIOTERAPIA = "Radioterapia",
  REUMATOLOGIA = "Reumatologia",
  UROLOGIA = "Urologia",
}

export const medicalSpecialties = Object.entries(MedicalSpecialty).map(([key, value]) => ({
  value: MedicalSpecialty[key as keyof typeof MedicalSpecialty],
  label: value,
}));

export const weekDays = [
  { key: 0, value: "Sunday", label: "Domingo" },
  { key: 1, value: "Monday", label: "Segunda-feira" },
  { key: 2, value: "Tuesday", label: "Terça-feira" },
  { key: 3, value: "Wednesday", label: "Quarta-feira" },
  { key: 4, value: "Thursday", label: "Quinta-feira" },
  { key: 5, value: "Friday", label: "Sexta-feira" },
  { key: 6, value: "Saturday", label: "Sábado" },
];

export const BUSINESS_HOURS = Array.from({ length: 35 }, (_, i) => {
  const minutes = 5 * 60 + i * 30;
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
});
