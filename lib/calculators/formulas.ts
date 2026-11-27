// lib/calculators/formulas.ts — Calculator logic (Section 10)
// All results are ESTIMATES. Confirm with your engineer or fundi.

export interface ConcreteInput {
  lengthM: number
  widthM: number
  thicknessM: number
  mix: '1:2:4' | '1:3:6' | '1:1.5:3'
}
export interface ConcreteResult {
  cementBags: number
  sandM3: number
  ballastM3: number
  volumeM3: number
}
export function calcConcrete(input: ConcreteInput, wastagePct = 10): ConcreteResult {
  const volume = input.lengthM * input.widthM * input.thicknessM
  const withWaste = volume * (1 + wastagePct / 100)
  // Mix ratios: parts cement : sand : ballast
  const ratios: Record<string, [number, number, number]> = {
    '1:2:4':   [1, 2, 4],
    '1:3:6':   [1, 3, 6],
    '1:1.5:3': [1, 1.5, 3],
  }
  const [c, s, b] = ratios[input.mix]
  const totalParts = c + s + b
  // 1 bag cement = 0.035 m³
  const cementM3 = (c / totalParts) * withWaste
  return {
    cementBags: Math.ceil(cementM3 / 0.035),
    sandM3: parseFloat(((s / totalParts) * withWaste).toFixed(2)),
    ballastM3: parseFloat(((b / totalParts) * withWaste).toFixed(2)),
    volumeM3: parseFloat(volume.toFixed(3)),
  }
}

export interface RoofingInput {
  lengthM: number
  widthM: number
  pitchDeg: number  // roof pitch in degrees
  slopes: number    // number of slopes (1 or 2)
}
export interface RoofingResult {
  sheetsMetres: number
  ridgeMetres: number
  roofingNails: number  // kg
}
export function calcRoofing(input: RoofingInput, wastagePct = 10): RoofingResult {
  const slopeLength = (input.widthM / 2) / Math.cos((input.pitchDeg * Math.PI) / 180)
  const areaPerSlope = slopeLength * input.lengthM
  const totalArea = areaPerSlope * input.slopes * (1 + wastagePct / 100)
  return {
    sheetsMetres: Math.ceil(totalArea),
    ridgeMetres: Math.ceil(input.lengthM * 1.1),
    roofingNails: Math.ceil(totalArea * 0.5), // approx 0.5 kg per m²
  }
}

export interface PaintInput {
  wallAreaM2: number
  coats: number
  coverageM2perL: number  // from admin config, default 8
}
export interface PaintResult {
  litres: number
  tins20L: number
  tins4L: number
  tins1L: number
}
export function calcPaint(input: PaintInput, wastagePct = 10): PaintResult {
  const totalLitres = (input.wallAreaM2 * input.coats) / input.coverageM2perL * (1 + wastagePct / 100)
  let remaining = Math.ceil(totalLitres)
  const tins20L = Math.floor(remaining / 20); remaining %= 20
  const tins4L  = Math.floor(remaining / 4);  remaining %= 4
  const tins1L  = remaining > 0 ? 1 : 0
  return { litres: Math.ceil(totalLitres), tins20L, tins4L, tins1L }
}

export interface SteelInput {
  slabLengthM: number
  slabWidthM: number
  barSpacingMM: number
  barDiameter: 'D8'|'D10'|'D12'|'D16'|'D20'|'D25'
  barLengthM: number  // standard 12 m
}
export interface SteelResult {
  barsLongway: number
  barsShortway: number
  totalBars: number
  bindingWireRolls: number
}
export function calcSteel(input: SteelInput, wastagePct = 5): SteelResult {
  const spacingM = input.barSpacingMM / 1000
  const barsLong = Math.ceil(input.slabWidthM / spacingM) + 1
  const barsShort = Math.ceil(input.slabLengthM / spacingM) + 1
  const totalBars = Math.ceil((barsLong + barsShort) * (1 + wastagePct / 100))
  return {
    barsLongway: barsLong,
    barsShortway: barsShort,
    totalBars,
    bindingWireRolls: Math.ceil(totalBars / 100),  // ~1 roll per 100 bars
  }
}

export interface TankInput {
  householdSize: number
  storageDays: number
  litresPerPersonPerDay: number  // from admin, default 50
}
export function calcTank(input: TankInput): { litres: number; recommendedCapacity: number } {
  const litres = input.householdSize * input.litresPerPersonPerDay * input.storageDays
  // Round up to nearest standard Kentank size
  const sizes = [1000, 2000, 3000, 5000, 10000]
  const recommended = sizes.find(s => s >= litres) ?? 10000
  return { litres: Math.round(litres), recommendedCapacity: recommended }
}

export interface BlockworkInput {
  wallLengthM: number
  wallHeightM: number
  blockLengthMM: number  // 400
  blockHeightMM: number  // 200
  openingsM2: number
  mortarBagsPerM2: number  // from admin, default 0.5
}
export interface BlockworkResult {
  blocks: number
  cementBags: number
  sandM3: number
  wallAreaM2: number
}
export function calcBlockwork(input: BlockworkInput, wastagePct = 10): BlockworkResult {
  const wallArea = input.wallLengthM * input.wallHeightM - input.openingsM2
  const blocksPerM2 = 1 / ((input.blockLengthMM / 1000) * (input.blockHeightMM / 1000))
  const blocks = Math.ceil(wallArea * blocksPerM2 * (1 + wastagePct / 100))
  const cementBags = Math.ceil(wallArea * input.mortarBagsPerM2 * (1 + wastagePct / 100))
  return {
    blocks,
    cementBags,
    sandM3: parseFloat((cementBags * 0.03).toFixed(2)),
    wallAreaM2: parseFloat(wallArea.toFixed(2)),
  }
}
