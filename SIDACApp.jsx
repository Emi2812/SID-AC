import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import jsPDF from "jspdf";

export default function SIDACApp() {
  const [view, setView] = useState("welcome");
  const [actas, setActas] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    rank: "",
    idnumber: "",
    lugar: "",
    fecha: "",
    hora: "",
    inspector: "",
    detalle: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generarNumeroActa = () => {
    const letras = form.lugar.substring(0, 3).toUpperCase();
    const numero = (actas.length + 1).toString().padStart(3, "0");
    const fecha = new Date(form.fecha);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();
    return `${letras}-${numero}-${dia}${mes}${año}`;
  };

  const generarPDF = () => {
    const numeroActa = generarNumeroActa();
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("ACTA DE INSPECCIÓN POLICIAL", 20, 20);
    doc.text(`N° de Acta: ${numeroActa}`, 20, 30);
    doc.text(`Lugar: ${form.lugar}`, 20, 40);
    doc.text(`Fecha: ${form.fecha}`, 20, 50);
    doc.text(`Hora: ${form.hora}`, 20, 60);
    doc.text(`Inspector: ${form.inspector}`, 20, 70);
    doc.text("Detalle:", 20, 80);
    const splitText = doc.splitTextToSize(form.detalle, 170);
    doc.text(splitText, 20, 90);

    doc.save(`Acta_${numeroActa}_SIDAC.pdf`);

    setActas([...actas, { ...form, numeroActa }]);
  };

  const mostrarHistorial = () => (
    <Card className="w-full mt-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Historial de Actas Generadas</h3>
        {actas.length === 0 ? (
          <p className="text-gray-600">No hay actas generadas aún.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto text-left">
            {actas.map((acta, index) => (
              <li key={index} className="border rounded p-2 bg-gray-50">
                <strong>Acta:</strong> {acta.numeroActa}<br />
                <strong>Lugar:</strong> {acta.lugar} — <strong>Fecha:</strong> {acta.fecha}<br />
                <strong>Inspector:</strong> {acta.inspector}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-white to-gray-200 flex items-center justify-center p-4">
      <div className="text-center w-full max-w-xl">
        {view === "welcome" && (
          <>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">SIDAC</h1>
            <h2 className="text-lg text-gray-700 mb-6">Sistema Informático Digital Acta Control</h2>
            <Button onClick={() => setView("login")}>Ingresar</Button>
          </>
        )}

        {view === "login" && (
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Inicio de Sesión</h3>
              <Input placeholder="Usuario" name="username" onChange={handleChange} className="mb-2" />
              <Input placeholder="Contraseña" type="password" name="password" onChange={handleChange} className="mb-4" />
              <Button className="w-full mb-2" onClick={() => setView("formulario")}>Ingresar</Button>
              <Button variant="ghost" className="w-full text-sm text-blue-700" onClick={() => setView("register")}>¿No tenés cuenta? Registrate</Button>
            </CardContent>
          </Card>
        )}

        {view === "register" && (
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Registro</h3>
              <Input placeholder="Nombre completo" name="fullname" onChange={handleChange} className="mb-2" />
              <Input placeholder="Jerarquía" name="rank" onChange={handleChange} className="mb-2" />
              <Input placeholder="Legajo N°" name="idnumber" onChange={handleChange} className="mb-2" />
              <Input placeholder="Usuario" name="username" onChange={handleChange} className="mb-2" />
              <Input placeholder="Contraseña" type="password" name="password" onChange={handleChange} className="mb-4" />
              <Button className="w-full mb-2" onClick={() => setView("formulario")}>Registrarse</Button>
              <Button variant="ghost" className="w-full text-sm text-blue-700" onClick={() => setView("login")}>Ya tengo cuenta</Button>
            </CardContent>
          </Card>
        )}

        {view === "formulario" && (
          <>
            <Card className="w-full">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-semibold mb-2">Formulario - Acta de Inspección</h3>
                <Input placeholder="Lugar de la inspección" name="lugar" onChange={handleChange} />
                <Input type="date" name="fecha" onChange={handleChange} />
                <Input type="time" name="hora" onChange={handleChange} />
                <Input placeholder="Inspector actuante" name="inspector" onChange={handleChange} />
                <Textarea placeholder="Detalle de la inspección" name="detalle" rows={6} onChange={handleChange} />
                <Button className="w-full" onClick={generarPDF}>Generar Acta PDF</Button>
              </CardContent>
            </Card>
            {mostrarHistorial()}
          </>
        )}
      </div>
    </div>
  );
}
