#include <Ethernet.h>
#include <SPI.h>
 
byte mac[] = {  0x90, 0xA2, 0xDA, 0x0D, 0xF6, 0xFF }; 
byte ip[] = {  192, 168, 15, 182 };
// byte gateway[] = { x,x,x,x };      

EthernetClient client;

String temp= "data=5";  

void setup(){

  Ethernet.begin(mac, ip);
  Serial.begin(9600);
  Serial.println(Ethernet.localIP());
  delay(1000);
  delay(1000);
  Serial.println("connecting...");
  
  if (client.connect("192.168.15.181",3000))
  {                                 
    Serial.println("Sending to Server: ");                    
    client.println("POST /teste HTTP/1.1");           
    Serial.print("POST /teste HTTP/1.1");
    client.println("Host: 192.168.15.181");
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.println("Connection: close");
    client.println("User-Agent: Arduino/1.0");
    client.print("Content-Length: ");
    client.println(temp.length());
    client.println();
    client.print(temp);
    client.println();                                           
  }else{
    Serial.println("Cannot connect to Server");               
  }

}

void loop(){

  if (client.available()) {
    char c = client.read();
    Serial.print(c);
  }

  if (!client.connected()){
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();
    for(;;)
      ;
  }

}
