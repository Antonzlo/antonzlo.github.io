import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import OptionGroup from "./OptionGroup";
import { SITE_TYPES, DOMAIN_OPTIONS, HOSTING_OPTIONS, ORG_TYPES, SCALE_OPTIONS } from "./pricing";
import { submitOrder } from "./api";
import { SUPPORTED_LANGUAGES } from "./i18n";

const LOCALE_MAP = { ru: "ru-RU", en: "en-US", fi: "fi-FI" };

function formatPrice(amount, from, t, lang) {
	const amountStr = `${new Intl.NumberFormat(LOCALE_MAP[lang] || "en-US").format(amount)} €`;
	return from ? t("price.from", { amount: amountStr }) : amountStr;
}

const initialFields = {
	name: "",
	email: "",
	phone: "",
	orgtype: "",
	bank: "",
	sitetype: "",
	scale: "",
	domain: "",
	hosting: "",
	notes: "",
	website: "", // honeypot - must stay empty
};

export default function App() {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [fields, setFields] = useState(initialFields);
	const [status, setStatus] = useState({ type: null, text: "" });
	const [sending, setSending] = useState(false);
	const [sent, setSent] = useState(false);

	const total = useMemo(() => {
		let sum = 0;
		const site = SITE_TYPES.find((o) => o.key === fields.sitetype);
		const domain = DOMAIN_OPTIONS.find((o) => o.key === fields.domain);
		const hosting = HOSTING_OPTIONS.find((o) => o.key === fields.hosting);
		if (site) sum += site.price;
		if (domain) sum += domain.price;
		if (hosting) sum += hosting.price;
		return sum;
	}, [fields.sitetype, fields.domain, fields.hosting]);

	const hasSelection = fields.sitetype || fields.domain || fields.hosting;

	function setField(name, value) {
		setFields((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (fields.website) return; // honeypot tripped, silently drop

		if (!fields.name.trim() || !fields.email.trim()) {
			setStatus({ type: "err", text: t("errors.missingRequired") });
			return;
		}
		if (!fields.sitetype) {
			setStatus({ type: "err", text: t("errors.missingSiteType") });
			return;
		}

		setSending(true);
		setStatus({ type: null, text: "" });

		try {
			await submitOrder({
				lang,
				name: fields.name.trim(),
				email: fields.email.trim(),
				phone: fields.phone.trim(),
				orgtype: fields.orgtype,
				bank: fields.bank,
				sitetype: fields.sitetype,
				scale: fields.scale,
				domain: fields.domain,
				hosting: fields.hosting,
				notes: fields.notes.trim(),
				total,
				website: fields.website,
			});
			setStatus({ type: "ok", text: t("success") });
			setSent(true);
		} catch (err) {
			const text =
				err.type === "network"
					? t("errors.connection")
					: err.details?.message || t("errors.generic");
			setStatus({ type: "err", text });
		} finally {
			setSending(false);
		}
	}

	const siteTypeOptions = SITE_TYPES.map((o) => ({
		key: o.key,
		label: t(`siteTypes.${o.key}.label`),
		note: t(`siteTypes.${o.key}.note`) || null,
		priceLabel: formatPrice(o.price, o.from, t, lang),
		required: true,
	}));

	const domainOptions = DOMAIN_OPTIONS.map((o) => ({
		key: o.key,
		label: t(`domains.${o.key}`),
		priceLabel: o.price > 0 ? `+${formatPrice(o.price, false, t, lang)}` : null,
	}));

	const hostingOptions = HOSTING_OPTIONS.map((o) => ({
		key: o.key,
		label: t(`hostings.${o.key}`),
		priceLabel: o.price > 0 ? `+${formatPrice(o.price, false, t, lang)}` : null,
		note: o.key === "setup" ? t("hostings.setupNote") : null,
	}));

	const bankOptions = [
		{ key: "yes", label: t("bank.yes") },
		{ key: "no", label: t("bank.no"), note: t("bank.noNote") },
	];

	return (
		<div className="atf-form">
			<div className="atf-lang-switch">
				{SUPPORTED_LANGUAGES.map((code) => (
					<button
						key={code}
						type="button"
						className={"atf-lang-btn" + (lang === code ? " on" : "")}
						onClick={() => i18n.changeLanguage(code)}
					>
						{code.toUpperCase()}
					</button>
				))}
			</div>

			<form onSubmit={handleSubmit}>
				<div className="atf-sec">
					<h3>{t("sections.contact")}</h3>
					<div className="atf-row">
						<label htmlFor="atf-name">{t("fields.name")}</label>
						<input
							id="atf-name"
							type="text"
							required
							aria-required="true"
							placeholder={t("fields.namePlaceholder")}
							value={fields.name}
							onChange={(e) => setField("name", e.target.value)}
						/>
					</div>
					<div className="atf-row">
						<label htmlFor="atf-email">{t("fields.email")}</label>
						<input
							id="atf-email"
							type="email"
							required
							aria-required="true"
							placeholder="you@example.com"
							value={fields.email}
							onChange={(e) => setField("email", e.target.value)}
						/>
					</div>
					<div className="atf-row">
						<label htmlFor="atf-phone">{t("fields.phone")}</label>
						<input
							id="atf-phone"
							type="tel"
							placeholder="+358 40 ..."
							value={fields.phone}
							onChange={(e) => setField("phone", e.target.value)}
						/>
					</div>
					{/* honeypot field, hidden from real users via CSS */}
					<div className="atf-hp" aria-hidden="true">
						<label htmlFor="atf-website">Website</label>
						<input
							id="atf-website"
							type="text"
							tabIndex={-1}
							autoComplete="off"
							value={fields.website}
							onChange={(e) => setField("website", e.target.value)}
						/>
					</div>
				</div>

				<div className="atf-sec">
					<h3>{t("sections.business")}</h3>
					<div className="atf-row">
						<label htmlFor="atf-orgtype">{t("fields.orgtype")}</label>
						<select
							id="atf-orgtype"
							value={fields.orgtype}
							onChange={(e) => setField("orgtype", e.target.value)}
						>
							<option value="">{t("fields.selectPlaceholder")}</option>
							{ORG_TYPES.map((key) => (
								<option key={key} value={key}>
									{t(`orgTypes.${key}`)}
								</option>
							))}
						</select>
					</div>
					<div className="atf-row">
						<label>{t("fields.bank")}</label>
						<OptionGroup
							name="bank"
							options={bankOptions}
							value={fields.bank}
							onChange={(v) => setField("bank", v)}
						/>
					</div>
				</div>

				<div className="atf-sec">
					<h3>{t("sections.scope")}</h3>
					<div className="atf-row">
						<label>{t("fields.sitetype")}</label>
						<OptionGroup
							name="sitetype"
							options={siteTypeOptions}
							value={fields.sitetype}
							onChange={(v) => setField("sitetype", v)}
						/>
					</div>
					<div className="atf-row">
						<label htmlFor="atf-scale">{t("fields.scale")}</label>
						<select id="atf-scale" value={fields.scale} onChange={(e) => setField("scale", e.target.value)}>
							<option value="">{t("fields.selectPlaceholder")}</option>
							{SCALE_OPTIONS.map((key) => (
								<option key={key} value={key}>
									{t(`scales.${key}`)}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="atf-sec">
					<h3>{t("sections.domain")}</h3>
					<OptionGroup
						name="domain"
						options={domainOptions}
						value={fields.domain}
						onChange={(v) => setField("domain", v)}
					/>
				</div>

				<div className="atf-sec">
					<h3>{t("sections.hosting")}</h3>
					<OptionGroup
						name="hosting"
						options={hostingOptions}
						value={fields.hosting}
						onChange={(v) => setField("hosting", v)}
					/>
				</div>

				<div className="atf-sec">
					<h3>{t("sections.extra")}</h3>
					<div className="atf-row">
						<label htmlFor="atf-notes">{t("fields.notes")}</label>
						<textarea
							id="atf-notes"
							placeholder={t("fields.notesPlaceholder")}
							value={fields.notes}
							onChange={(e) => setField("notes", e.target.value)}
						/>
					</div>
				</div>

				<div className="atf-price-box">
					<span>{t("price.estimated")}</span>
					<span className="atf-total">{hasSelection ? `${total} €` : t("price.placeholder")}</span>
				</div>

				{!sent && (
					<button className="atf-btn" type="submit" disabled={sending}>
						{sending ? t("sending") : t("submit")}
					</button>
				)}

				{status.type && <div className={"atf-msg " + status.type}>{status.text}</div>}
			</form>
		</div>
	);
}
