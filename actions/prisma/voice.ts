import prisma from "@/util/prisma";

export const getVoiceByfilter = async (language: string, gender: string) => {
  try {
    const langCondition = { Locale: { contains: language } };
    const genderCondition = gender === "All" ? {} : { Gender: gender };

    const where = { ...langCondition, ...genderCondition };

    const voices = await prisma.voice.findMany({ where });

    // contains 条件为大小写不敏感，所以需要二次过滤
    const filteredVoices = voices.filter((voice) => voice.Locale.includes(language));

    return filteredVoices;
  } catch (error) {
    throw error;
  }
};
