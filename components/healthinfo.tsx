import React from 'react';

export default function HealthInfoCard({
	condition,
	symptoms,
	recommendations,
}: any) {
	return (
		<div className="health-info-card">
			<h2>{condition}</h2>
			<h3>Symptoms:</h3>
			<ul>
				{symptoms.map((symptom: any, index: any) => (
					<li key={index}>{symptom}</li>
				))}
			</ul>
			<h3>Recommendations:</h3>
			<ul>
				{recommendations.map((recommendation: any, index: any) => (
					<li key={index}>{recommendation}</li>
				))}
			</ul>
		</div>
	);
}
