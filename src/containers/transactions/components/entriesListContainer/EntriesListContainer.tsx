import React, { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import EntriesListItem from '../entriesListItem/EntriesListItem';
import { IDespesa } from '../../../../types/IDespesa';
import { IReceita } from '../../../../types/IReceita';
import { formatCurrency } from '../../../../utils/currencyUtils';
import { COLORS } from '../../../../theme/colors';
import './EntriesListContainer.scss';

type SimpleList = Pick<IDespesa | IReceita, 'id' | 'descricao' | 'valor' | 'observacoes'> & {
	categoria?: string;
	subcategoria?: string;
};

interface IEntriesListContainerProps {
	title: string;
	children?: React.ReactNode;
	data?: Array<IDespesa | IReceita | SimpleList>;
	hideValues?: boolean;
	hideTags?: boolean;
	mergeDuplicates?: boolean;
}

const EntriesListContainer = ({ children, title, data, hideValues = false, hideTags = false }: IEntriesListContainerProps) => {
	const showEmptyMessage = useMemo(() => !data?.length && !children, []);

	return (
		<Container className="EntriesListContainer">
			<h4 className="EntriesListContainer__title">{title}</h4>
			{showEmptyMessage && <h5>Nenhum dado foi encontrado</h5>}
			<ul className="EntriesListContainer__list list-unstyled">
				{data?.map(({ id, descricao, valor, observacoes, categoria, subcategoria }, index) => (
					<EntriesListItem
						key={id}
						title={descricao}
						value={formatCurrency(valor)}
						subtitle={observacoes}
						tags={!hideTags && categoria && subcategoria ? [categoria, subcategoria] : undefined}
						hideValue={hideValues}
						color={index % 2 === 0 ? COLORS.CLEAR_SHADES_GRAY : 'initial'}
					/>
				))}
			</ul>
			{children}
		</Container>
	);
};

export default EntriesListContainer;
