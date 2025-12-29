package com.example.snappy.service;

import com.example.snappy.entity.Stage;
import org.springframework.stereotype.Service;

@Service
public class AIEngineService {

    public String generateClientReply(Stage stage) {

        return switch (stage) {
            case INTRO ->
                    "Bonjour, j’aimerais en savoir plus sur vos services.";
            case NEED ->
                    "J’ai un petit business et je cherche une solution adaptée à mon budget.";
            case SOLUTION ->
                    "Votre solution m’intéresse, comment cela fonctionne concrètement ?";
            case PRICE ->
                    "Quel est le prix et y a-t-il des facilités de paiement ?";
            case OBJECTION ->
                    "J’hésite encore, est-ce que c’est vraiment rentable pour moi ?";
            case CLOSING ->
                    "D’accord, comment peut-on commencer ?";
        };
    }
}
