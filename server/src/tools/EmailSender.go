package tools

import (
	"gopkg.in/gomail.v2"
	"errors"
)

type EmailSender struct {}

func (*EmailSender) Send (from string, to string, subject string, message string) error {
	if len(from) == 0 {
		return errors.New("Vous devez saisir un expediteur")
	}

	if len(to) == 0 {
		return errors.New("Vous devez saisir un destinataire")
	}

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", message)

	d := gomail.NewDialer("smtp.gmail.com", 465, "encom.agency@gmail.com", "0890877542901")

	// Send the email to Bob, Cora and Dan.
	if err := d.DialAndSend(m); err != nil {
		println(err.Error())
		return errors.New("Erreur lors de l'envoie du mail")
	}

	return nil
}
