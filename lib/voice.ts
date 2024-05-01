import { Voice } from "@prisma/client";
import prisma from "./prisma";

export const createVoice = async (voices: Voice[]) => {
  await prisma.voice.createMany({
    data: voices,
  });
};
