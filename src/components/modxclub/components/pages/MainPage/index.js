

import React, { Component } from 'react';


import Page from '../layout';


import Forum from "../../view/forum"


export class MainPage extends Page {


	setPageMeta(meta = {}) {

		return super.setPageMeta({
			title: "Главная страница",
		});

	}


	render() {

		const {
			...other
		} = this.props;


		const {
			getQueryFragment,
		} = this.context;

		return super.render(<Forum
			getQueryFragment={getQueryFragment}
			{...other}
		/>)
	}

}

export default MainPage;
