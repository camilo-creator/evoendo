const $ = (id) => document.getElementById(id);

function getIrrig() {
  const v = $("irrig").value;
  if (v === "Personalizado") return ($("irrigCustom").value || "Irrigación según protocolo");
  return v;
}

function normalizeSpaces(s) {
  return (s || "").replace(/\s+/g, " ").trim();
}

function buildBase() {
  const pieza = normalizeSpaces($("pieza").value);
  const lt = normalizeSpaces($("lt").value);
  const conductos = normalizeSpaces($("conductos").value);
  const prep = normalizeSpaces($("prep").value);
  const sesion = $("sesion").value;
  const irrig = normalizeSpaces(getIrrig());
  const obt = $("obt").value;
  const inc = $("inc").value;
  const notas = normalizeSpaces($("notas").value);

  return { pieza, lt, conductos, prep, sesion, irrig, obt, inc, notas };
}

function rayenUltra(d) {
  let s = `Pieza ${d.pieza}: Endodoncia (${d.sesion}). LT ${d.lt} mm. PB ${d.conductos} hasta ${d.prep}. Irrig ${d.irrig}. ${d.obt}.`;
  s += (d.inc === "no") ? " Sin eventos intraop." : " Con eventos intraop (registrar detalle).";
  if (d.notas) s += ` ${d.notas}.`;
  return s;
}

function endoSenior(d) {
  let s = `Pieza ${d.pieza}: TTO endodóntico ${d.sesion}. LT ${d.lt} mm. `
        + `PB en ${d.conductos} a ${d.prep} con irrigación ${d.irrig}. `
        + `${d.obt}.`;
  s += (d.inc === "no") ? " Sin incidentes." : " Incidentes intraop (detallar).";
  if (d.notas) s += ` ${d.notas}.`;
  return s;
}

function medicoLegal(d) {
  let s = `Pieza ${d.pieza}: Procedimiento endodóntico ${d.sesion}. LT ${d.lt} mm. `
        + `Instrumentación en ${d.conductos} hasta ${d.prep} con irrigación copiosa (${d.irrig}). `
        + `${d.obt}. `;
  s += (d.inc === "no") ? "Sin eventos intraoperatorios." : "Eventos intraoperatorios presentes (detallar en ficha).";
  s += " Indicaciones y control según evolución.";
  if (d.notas) s += ` Nota: ${d.notas}.`;
  return s;
}

function setOut(text) {
  $("out").textContent = text;
}

function copyOut() {
  const text = $("out").textContent || "";
  if (!text) return;
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  });
}

$("irrig").addEventListener("change", () => {
  $("irrigCustomWrap").style.display = ($("irrig").value === "Personalizado") ? "block" : "none";
});

$("btnRayen").addEventListener("click", () => setOut(rayenUltra(buildBase())));
$("btnSenior").addEventListener("click", () => setOut(endoSenior(buildBase())));
$("btnML").addEventListener("click", () => setOut(medicoLegal(buildBase())));

$("btnCopy").addEventListener("click", copyOut);

$("btnClear").addEventListener("click", () => {
  $("out").textContent = "";
  $("notas").value = "";
});
