import{m as n,j as e,L as a}from"./app-DgZYpFq7.js";import{T as m}from"./text-link-D_fAAHv4.js";import{B as l}from"./button-DzvBAvYb.js";import{A as c}from"./auth-layout-D76027RK.js";import{L as u}from"./loader-circle-CbziKJXK.js";import"./app-nklVn4u_.js";import"./utils-jAU0Cazi.js";import"./index-C9XCcCFj.js";import"./app-logo-icon-Dkusirb4.js";import"./createLucideIcon-Bp4--aub.js";function k({status:t}){const{post:o,processing:i}=n({}),r=s=>{s.preventDefault(),o(route("verification.send"))};return e.jsxs(c,{title:"Verify email",description:"Please verify your email address by clicking on the link we just emailed to you.",children:[e.jsx(a,{title:"Email verification"}),t==="verification-link-sent"&&e.jsx("div",{className:"mb-4 text-center text-sm font-medium text-green-600",children:"Un nouveau lien de vérification a été envoyé à l'adresse e-mail que vous avez fournie lors de l'inscription."}),e.jsxs("form",{onSubmit:r,className:"space-y-6 text-center",children:[e.jsxs(l,{disabled:i,variant:"secondary",children:[i&&e.jsx(u,{className:"h-4 w-4 animate-spin"}),"Envoyer un nouveau lien de vérification"]}),e.jsx(m,{href:route("logout"),method:"post",className:"mx-auto block text-sm",children:"Se deconnecter"})]})]})}export{k as default};
//# sourceMappingURL=verify-email-CP9HjFd4.js.map
