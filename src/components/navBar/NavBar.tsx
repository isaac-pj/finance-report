import React, { useMemo } from 'react';

import { Navbar, Container, Dropdown, Nav, Button } from 'react-bootstrap';
import chartData from '../../data/database.json';
import { getMonthName } from '../../utils/dateUtils';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import { groupBy } from '../../utils/objectUtils';
import { removeDuplicates } from '../../utils/arrayUtils';
import { Link } from 'react-router-dom';
import { SelectCallback } from '@restart/ui/esm/types';
import './NavBar.scss';

interface INavBarProps {
	handleToggleMenu: () => void;
	handleYearChange: SelectCallback;
	handleMonthChange: SelectCallback;
	year: string;
	month: string;
}

const NavBar = ({ handleToggleMenu, handleYearChange, handleMonthChange, year, month }: INavBarProps) => {
	const availableYears = useMemo(
		() => removeDuplicates(Object.keys(groupBy(chartData, 'pagamento')).map(date => date.split('/')[2])),
		[chartData, groupBy, removeDuplicates],
	);

	const availableMonths = useMemo(
		() => removeDuplicates(Object.keys(groupBy(chartData, 'pagamento')).map(date => date.split('/')[1])),
		[chartData, groupBy, removeDuplicates],
	);

	// console.log(removeDuplicates(Object.keys(groupBy(chartData, "pagamento"))));

	const [lastYear] = useMemo(() => availableYears.sort(), [availableYears]);
	const [lastMonth] = useMemo(() => availableMonths.sort(), [availableMonths]);

	{
		/* <Nav onClick={handleToggleMenu}>
  <Button bg="dark">
    <i className="material-icons">menu</i>
  </Button>
</Nav> */
	}

	return (
		<Navbar sticky="top" bg="dark" variant="dark" expand="lg" className="navbar-light">
			<Container>
				<Navbar.Brand>Relatório Financeiro</Navbar.Brand>

				<Navbar.Toggle aria-controls="navbar-nav" />

				<Navbar.Collapse id="navbar-nav">
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<Link to="/finance-report/dashboard" className="nav-link">
								Dashboard
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/finance-report/transactions" className="nav-link">
								Transctions
							</Link>
						</li>
					</ul>

					<Dropdown onSelect={handleYearChange} className="me-3">
						<Dropdown.Toggle variant="outline-secondary" id="dropdown-year">
							{year || lastYear || 'Ano'}
						</Dropdown.Toggle>
						<Dropdown.Menu>
							{availableYears.map(item => (
								<Dropdown.Item key={item} eventKey={item}>
									{item}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>

					<Dropdown onSelect={handleMonthChange} className="me-3">
						<Dropdown.Toggle variant="outline-secondary" id="dropdown-month">
							{month || lastMonth
								? capitalizeFirstLetter(
										getMonthName(`01/${month || lastMonth}/${year || new Date().getFullYear().toString()}`),
								  )
								: 'Mês'}
						</Dropdown.Toggle>
						<Dropdown.Menu>
							{availableMonths.map(item => (
								<Dropdown.Item key={item} eventKey={item}>
									{capitalizeFirstLetter(
										getMonthName(`01/${item}/${year || new Date().getFullYear().toString()}`),
									)}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavBar;
