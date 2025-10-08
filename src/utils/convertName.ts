import { romanizeWithType } from "@daun_jung/korean-romanizer"
import { Type } from "@daun_jung/korean-romanizer"

const mapFamilyName: Record<string, string> = {
  'I': 'LEE',
  'GWON': 'KWON'
}

export const convertName = (name: string) => {
  const [family_name, last_name] = romanizeWithType(name, Type.Name).toUpperCase().split(' ');

  return `${last_name} ${mapFamilyName[family_name] || family_name}`;
}