enum genderEnum {
  male = "Masculino",
  female = "Feminino",
}
export const genders = Object.entries(genderEnum).map(([key, value]) => ({
  key,
  value,
}));

export const getGenderLabel = (gender: "male" | "female") =>
  genders.find((g) => g.key === gender)?.value ?? gender;
