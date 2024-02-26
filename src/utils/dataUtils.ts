import { IDespesa } from '../types/IDespesa';
import { removeDuplicates } from './arrayUtils';

export const countValueOf = (dataArr: { valor: string; encargos?: string | number }[], decimals?: number): number => {
	return Number(
		dataArr.reduce((total, { valor, encargos }) => total + (Number(valor) + Number(encargos || 0)), 0).toFixed(decimals || 2),
	);
};

export const countValueOfByGroup = (dataArr: { valor: string; encargos?: string }[][], decimals?: number): number[] => {
	return dataArr.map(entries => countValueOf(entries, decimals));
};

export const mergeDuplicatesByProps = <T>(data: T[], props: (keyof T)[]): T[] => {
	const mergedData: T[] = [];

	for (const object of data) {
		const similar: T | undefined = mergedData.find(mergedObj => props.every(prop => mergedObj[prop] === object[prop]));

		if (similar) {
			for (const [key, prev] of Object.entries(similar)) {
				const curr = object[key as keyof T];
				if (typeof curr === 'string')
					similar[key as keyof T] = (
						(prev as string).includes(curr) ? prev : `${prev} | ${curr}`
					) as NonNullable<T>[keyof T];
				if (typeof curr === 'number') similar[key as keyof T] = ((prev as number) + curr) as NonNullable<T>[keyof T];
				if (typeof curr === 'boolean') similar[key as keyof T] = (prev && curr) as NonNullable<T>[keyof T];
			}
		} else {
			mergedData.push(object);
		}
	}
	return mergedData;
};

export const groupExpensesByCategory = (expenses: IDespesa[], categories?: string[]) => {
	const groups = categories ? categories : removeDuplicates(expenses.map(({ categoria }) => categoria));
	const data = groups.map(category =>
		expenses
			.filter(({ categoria }) => categoria === category)
			.reduce(
				({ id, valor, ...tv }, cv) => ({
					...tv,
					valor: Number(valor) + Number(cv.valor),
					id: id ? `${id} | ${cv.id}` : cv.id,
					// subcategoria: removeDuplicates(
					// 	(subcategoria ? `${subcategoria} | ${cv.subcategoria}` : cv.subcategoria).split(' | '),
					// ).join(' | '),
					// observacoes:
					// 	observacoes && cv.observacoes ? `${observacoes}, ${cv.observacoes}` : cv?.observacoes || observacoes,
				}),
				{
					descricao: `Gastos com ${category}`,
					valor: 0,
					observacoes: 'Despesas agrupadas',
					categoria: category,
					subcategoria: '...',
					id: '',
				},
			),
	);

	return data;
};

export const removeDistinctByProps = <T>(arr: T[], props: Array<keyof T>): T[] => {
	return arr.filter((item, index) => arr.findIndex(obj => props.every(prop => obj[prop] === item[prop])) !== index);
};
