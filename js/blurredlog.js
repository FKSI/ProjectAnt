function pasuser(form) {
        if (form.username.value=="corps2014") { 
            if (form.password.value=="corps2014") {              
                location="home.html" 
            } else {
                alert("Identifiant et/ou mot de passe invalide")
            }
        } else {  
            alert("Identifiant et/ou mot de passe invalide")
        }
}