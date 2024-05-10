import prisma from "@/util/prisma";

export const getVoiceByfilter = async (language: string, gender: string, role: string) => {
  try {
    const langCondition = { Locale: { contains: language } };
    const genderCondition = gender === "All" ? {} : { Gender: gender };
    const roleCondition = role === "All" ? {} : { RolePlayList: { contains: role } };
    const where = { ...langCondition, ...genderCondition, ...roleCondition };

    const voices = await prisma.voice.findMany({ where });

    // contains 条件为大小写不敏感，所以需要二次过滤
    const filteredVoices = voices.filter((voice) => voice.Locale.includes(language));

    return filteredVoices;
  } catch (error) {
    throw error;
  }
};

export const getVoiceRoles = async () => {
  try {
    const voices = await prisma.voice.findMany({
      select: { RolePlayList: true },
    });

    const roleSet = new Set<string>();
    voices.forEach((v) => {
      if (v.RolePlayList) {
        JSON.parse(v.RolePlayList).forEach((role: string) => {
          roleSet.add(role);
        });
      }
    });

    return [...roleSet];
  } catch (error) {
    throw error;
  }
};
