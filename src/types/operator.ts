export type OperatorType = 
  | "MEO" | "NOS" | "VODAFONE" | "NOWO"
  | "ENDESA" | "IBERDROLA" | "REPSOL" | "GALP" | "G9"
  | "IBELECTRA" | "EDP" | "SU_ELETRICIDADE" | "GOLD_ENERGY"
  | "MEO_ENERGIA" | "PLENITUDE";

export type ServiceType = 
  | "1P_MOBILE"
  | "1P_INTERNET"
  | "2P_FIXED_CHANNELS"
  | "2P_FIXED_INTERNET"
  | "3P"
  | "4P";

export const TELECOM_OPERATORS: OperatorType[] = ['MEO', 'NOS', 'VODAFONE', 'NOWO'];

export const ENERGY_OPERATORS: OperatorType[] = [
  'ENDESA', 'IBERDROLA', 'REPSOL', 'GALP', 'G9', 
  'IBELECTRA', 'EDP', 'SU_ELETRICIDADE', 'GOLD_ENERGY',
  'MEO_ENERGIA', 'PLENITUDE'
];

export const SERVICES: ServiceType[] = [
  '1P_MOBILE',
  '1P_INTERNET',
  '2P_FIXED_CHANNELS',
  '2P_FIXED_INTERNET',
  '3P',
  '4P'
];