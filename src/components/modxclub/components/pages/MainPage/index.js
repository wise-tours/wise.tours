

import React, { Component } from 'react';


import Page from '../layout';


import Forum from "../../view/forum"
import { Grid, Link } from '@modxclub/ui';
import { Typography } from 'material-ui';

import Comments from "./Comments";
import Tasks from "./Tasks";

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

		return super.render(<Grid
			container
			spacing={16}
		>
			<Grid
				item
				xs={12}
				lg={8}
			>

				<Link
					to="/topics"
					title="Комментарии"
				>
					<Typography
						variant="subheading"
					>
						Публикации
					</Typography>
				</Link>

				<div
					style={{
						overflow: "auto",
					}}
				>
					<Forum
						getQueryFragment={getQueryFragment}
						{...other}
					/>
				</div>
			</Grid>
			<Grid
				item
				xs={12}
				lg={4}
			>

				<Grid
					container
					spacing={16}
				>

					<Grid
						item
						xs={12}
						sm={6}
						lg={12}
					>

						<Link
							to="/tasks"
							title="Задачи"
						>
							<Typography
								variant="subheading"
							>
								Активные задачи
							</Typography>
						</Link>

						<Tasks />

					</Grid>

					<Grid
						item
						xs={12}
						sm={6}
						lg={12}
					>

						<Link
							to="/comments"
							title="Комментарии"
						>
							<Typography
								variant="subheading"
							>
								Последние комментарии
							</Typography>
						</Link>

						<Comments />

					</Grid>

				</Grid>


			</Grid>
		</Grid>)
	}

}

export default MainPage;
