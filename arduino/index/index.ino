#include <Ethernet.h>
#include <PubSubClient.h>

byte mac[] = {  0x90, 0xA2, 0xDA, 0x0D, 0xF6, 0xFF }; 
byte ip[] = {  192, 168, 15, 189 };

EthernetClient ethClient;
PubSubClient mqttClient(ethClient);

const int pinoSensor = A7; //PINO UTILIZADO PELO SENSOR
int valorLido; //VARIÁVEL QUE ARMAZENA O PERCENTUAL DE UMIDADE DO SOLO
int erroMqtt;
String msg;
char msgTemp[50];
int comando;

int analogSoloSeco = 400; //VALOR MEDIDO COM O SOLO SECO (VOCÊ PODE FAZER TESTES E AJUSTAR ESTE VALOR)
int analogSoloMolhado = 150; //VALOR MEDIDO COM O SOLO MOLHADO (VOCÊ PODE FAZER TESTES E AJUSTAR ESTE VALOR)
int percSoloSeco = 0; //MENOR PERCENTUAL DO SOLO SECO (0% - NÃO ALTERAR)
int percSoloMolhado = 100; //MAIOR PERCENTUAL DO SOLO MOLHADO (100% - NÃO ALTERAR)

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Nova mensagem [");
  Serial.print(topic);
  Serial.print("] ");
  comando = atoi((char *)payload);
  Serial.println(comando);
  if(comando == 1){
    Serial.println("IRRIGANDO");
    digitalWrite(LED_BUILTIN, HIGH);
    delay(3000);
    digitalWrite(LED_BUILTIN, LOW);
    Serial.println("PARANDO IRRIGACAO");
    mqttClient.publish("irrigacao", "0");
  }else if(comando == 0){
    Serial.println("PARANDO IRRIGACAO");
  }
}

void setup(){
 pinMode(LED_BUILTIN, OUTPUT);
 mqttClient.setServer("192.168.15.181", 1883);
 mqttClient.setCallback(callback);
 Ethernet.begin(mac, ip);
 Serial.begin(9600); //INICIALIZA A SERIAL
 Serial.println(Ethernet.localIP());
 if(mqttClient.connect("arduino")){
  if(mqttClient.subscribe("irrigacao")){
    Serial.println("Inscrito");  
  }
  Serial.println("Conectado");
 }
 delay(5000); //INTERVALO DE 5 SEGUNDOS
 Serial.println("Lendo a umidade do solo..."); //IMPRIME O TEXTO NO MONITOR SERIAL
}

void loop(){
 valorLido = constrain(analogRead(pinoSensor),analogSoloMolhado,analogSoloSeco); //MANTÉM valorLido DENTRO DO INTERVALO (ENTRE analogSoloMolhado E analogSoloSeco)
 valorLido = map(valorLido,analogSoloMolhado,analogSoloSeco,percSoloMolhado,percSoloSeco); //EXECUTA A FUNÇÃO "map" DE ACORDO COM OS PARÂMETROS PASSADOS
 //Serial.print("Umidade do solo: "); //IMPRIME O TEXTO NO MONITOR SERIAL
 //Serial.print(valorLido); //IMPRIME NO MONITOR SERIAL O PERCENTUAL DE UMIDADE DO SOLO
 //Serial.println("%"); //IMPRIME O CARACTERE NO MONITOR SERIAL
 msg = String(valorLido);
 msg.toCharArray(msgTemp, msg.length() + 1);
 if(mqttClient.publish("humidade", msgTemp)){
  //Serial.println("Mensagem enviada ao Broker");
 }else{
  erroMqtt = mqttClient.state();
  Serial.print("ERRO: ");
  Serial.println(erroMqtt);
 }

 mqttClient.loop();
 delay(1000);  //INTERVALO DE 1 SEGUNDO
}
