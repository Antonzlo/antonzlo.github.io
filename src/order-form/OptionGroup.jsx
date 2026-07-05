import React from "react";

export default function OptionGroup({ name, options, value, onChange }) {
	return (
		<div className="atf-opts">
			{options.map((opt) => (
				<label key={opt.key} className={"atf-opt" + (value === opt.key ? " on" : "")}>
					<input
						type="radio"
						name={name}
						value={opt.key}
						checked={value === opt.key}
						required={opt.required}
						aria-required={opt.required || undefined}
						onChange={() => onChange(opt.key)}
					/>
					<span className="atf-opt-body">
						{opt.label}
						{opt.priceLabel ? (
							<>
								{" "}
								&mdash; <strong>{opt.priceLabel}</strong>
							</>
						) : null}
						{opt.note ? <span className="atf-opt-note">{opt.note}</span> : null}
					</span>
				</label>
			))}
		</div>
	);
}
