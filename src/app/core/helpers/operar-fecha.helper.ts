import { addDays, addMonths, parse, subDays, subMonths } from 'date-fns';

export function operarFecha(dateString: string | Date, diasMeses: number, operacion: 'suma' | 'resta', esDia = true): Date {
  const date = typeof dateString === 'string' ? parse(dateString, 'dd/MM/yyyy', new Date()) : dateString;
  const result = operacion === 'suma' ? ( esDia ? addDays(date, diasMeses) : addMonths(date, diasMeses) ) : ( esDia ? subDays(date, diasMeses): subMonths(date, diasMeses) );

  return result;
}
