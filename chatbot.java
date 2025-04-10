// ChatbotClient.java
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;

public class ChatbotClient {
    private static final String BASE_URL = "http://localhost:5000";
    
    public static String sendChatMessage(String message) throws IOException {
        JSONObject payload = new JSONObject();
        payload.put("message", message);
        
        return sendPostRequest(BASE_URL + "/chat", payload);
    }
    
    public static String sendLearningData(String text, String topic) throws IOException {
        JSONObject payload = new JSONObject();
        payload.put("text", text);
        payload.put("topic", topic);
        
        return sendPostRequest(BASE_URL + "/learn", payload);
    }
    
    private static String sendPostRequest(String urlString, JSONObject payload) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Accept", "application/json");
        connection.setDoOutput(true);
        
        try(OutputStream os = connection.getOutputStream()) {
            byte[] input = payload.toString().getBytes("utf-8");
            os.write(input, 0, input.length);           
        }
        
        try(BufferedReader br = new BufferedReader(
            new InputStreamReader(connection.getInputStream(), "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            return response.toString();
        }
    }
    
    public static void main(String[] args) {
        try {
            // Example conversation
            String response = sendChatMessage("What is artificial intelligence?");
            System.out.println("Chatbot: " + new JSONObject(response).getString("response"));
            
            // Example learning
            String learnResponse = sendLearningData(
                "Artificial intelligence is the simulation of human intelligence processes by machines.", 
                "AI definition");
            System.out.println("Learning status: " + learnResponse);
            
            // Query again after learning
            response = sendChatMessage("Tell me about AI");
            System.out.println("Chatbot: " + new JSONObject(response).getString("response"));
            
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}