package main

import (
	"fmt"
	"html/template"
	"net/http"

	"github.com/gorilla/mux"
)

var templates = template.Must(template.ParseFiles("templates/home.html", "templates/about.html", "templates/contact.html"))

func main() {
	router := mux.NewRouter()

	// Define routes for different pages
	router.HandleFunc("/", homeHandler).Methods("GET")
	router.HandleFunc("/about", aboutHandler).Methods("GET")
	router.HandleFunc("/contact", contactHandler).Methods("GET")

	// Serve static files (e.g., CSS, JS) from the "static" directory
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	fmt.Println("Server is running on :8080")
	http.Handle("/", router)
	http.ListenAndServe(":8080", nil)
}

func renderHTML(w http.ResponseWriter, tmpl string) {
	err := templates.ExecuteTemplate(w, tmpl+".html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	renderHTML(w, "home")
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
	renderHTML(w, "about")
}

func contactHandler(w http.ResponseWriter, r *http.Request) {
	renderHTML(w, "contact")
}
