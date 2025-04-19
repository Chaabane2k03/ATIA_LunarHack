import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    HiAtSymbol,
    HiOutlineDeviceMobile
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";

import CustomEmailButton from '../../buttons/CustomEmailButton';

import img from '../../../assets/images/univ9.jpg';

export default function Login() {

    const [loginData, setLoginData] = useState({
        email: "",
        mot_de_passe: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: "http://localhost/Softech_IGL3/backend/public/api/login.php",
            data: loginData
        })
        .then((res) => {
            if (res.status === 200) {

                const {id , nom , prenom , role , niveau , frais_inscription, frais_paye} = res.data.data;

                sessionStorage.setItem("id", id);
                sessionStorage.setItem("nom", nom);
                sessionStorage.setItem("prenom", prenom);
                sessionStorage.setItem("role", role);
                sessionStorage.setItem("niveau_id", niveau.id);
                sessionStorage.setItem("niveau_nom", niveau.nom);
                sessionStorage.setItem("frais_inscription", frais_inscription);
                sessionStorage.setItem("est_paye" , frais_paye);
                toast.success("Connexion réussie !");
                if (role === 'admin') {
                    setTimeout(() => {
                    navigate("/dashboard_admin"); 
                }, 1500);
                }
                else {
                setTimeout(() => {
                    navigate("/dashboard"); 
                }, 1500);
            }
            } else {
                toast.error(res.data.message || "Erreur lors de la connexion.");
            }
        })
        .catch((err) => {
            if (err.response) {
                toast.error(err.response.data.message || "Erreur lors de la connexion.");
            } else {
                toast.error("Erreur lors de la connexion.");
            }
        });
    };

    return (
        <>
            <ToastContainer />

            <div className='h-screen bg-blue-50'>
                <div className='bg-blue-50 flex items-center justify-center'>
                    <div className="bg-blue-50 m-auto bg-slate-50 rounded-3xl w-5/6 h-auto grid lg:grid-cols-2 drop-shadow-2xl">
                        <div className='w-full rouded-1-3x1 relative overflow-hidden'>
                            <img src={img} alt='accueil' className='w-full h-full object-cover rounded' />
                        </div>

                        <section className="w-3/4 mx-auto flex flex-col justify-center gap-10 text-center py-8">
                            <div className="title items-center">
                                <h1 className='text-gray-800 text-4x1 font-bold py-4'>Page de connexion</h1>
                                <p className="w-auto mx-auto text-gray-400">
                                Veuillez entrer vos identifiants de connexion pour accéder à votre compte personnel et profiter de toutes les fonctionnalités offertes par notre plateforme.
                                En cas des problèmes . N'hésitez pas à nous contacter tout en envoyany
                                </p>
                            </div>


                            <div className='w-full flex flex-col justify-center items-center gap-2'>
                                <CustomEmailButton  email="raed.bettaher@etudiant-fst.utm.tn"/>
                            </div>

                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <div className="flex relative">
                                    <input
                                        className="w-full py-3 sm:px-6 px-3 border rounded"
                                        type="email"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleChange}
                                        placeholder={"Adresse email"}
                                        required
                                    />
                                    <span className="icon flex items-center sm:px-4 px-2">
                                        <HiAtSymbol size={25} />
                                    </span>
                                </div>

                                <div className="flex relative">
                                    <input
                                        className="w-full py-3 sm:px-6 px-3 border rounded"
                                        type="password"
                                        name="mot_de_passe"
                                        value={loginData.mot_de_passe}
                                        onChange={handleChange}
                                        placeholder={"Votre mot de passe"}
                                        required
                                    />
                                    <span className="icon flex items-center sm:px-4 px-2">
                                        <HiOutlineDeviceMobile size={25} />
                                    </span>
                                </div>

                                <div className="input-button">
                                    <button type="submit" className="cursor-pointer select-none rounded-2xl py-3 px-8 text-lg bg-blue-500 text-white hover:bg-blue-200 hover:text-blue-600 hover:scale-105 transition-all duration-300 ease-in-out">
                                        {"Se connecter"}
                                    </button>
                                </div>


                                <div>
                                    <p>Vous n'avez pas encore de compte ? Inscrivez vous</p>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}