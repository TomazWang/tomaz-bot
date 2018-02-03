# Tomaz Bot

> Formerly stingky-tufo line bot.
> 
> A chatbot built with node.js, api.ai, firebase.


## TODO
- [ ] Add Api.ai
- [ ] Add Firebase as db
- [ ] All the following... 

### Handle inputs

```
User --(inputs)--> line_callback ------->  LineBot
  ^                     |
  |                     |
  +--(response 200)-----+





                            FullfillmentHandler <-> ( DialogFlow )
                                                        ^ |
                                                        | |
                                                        | v
                                +--[[simple text]]---> AiBot ---+
                                |                               |
                                |                          (as intent)
                                |                               |
         (filter input type)    |                               v
LineBot ------------------------+--[[action text]]----> IntentHandler ---> -+
   ^                            |                               ^           |
   |                        [[postback]]                        |           |
   |                            |                           (as intent)     |
   |                            |                               |           V
   |                            +---EventHandler----------------+           |
   |                                                                        |
   |                                                                        |
   +------------- <---------------------- <--------------------- <----------+
            (send reply)            (convert reply)         (handle intent)
            
            
            
            
            

         (/)
      * ------>  index and doc 
     /
    /    (/bots)         (/bots/line)
app ---------------*--------------------->  LineBot
    \              | 
     \             |     (/bots/<other>)
      \             +-------------------->  OtherBot
       \              
        \
         \   (/ai)       (/ai/webhook)
          *-----------*------------------>  FullfillmentHandler

            

```


#### LineBot
> LineBot handles all inputs from line.
- Has the ability to reply a line message.
- Has the ability to push a line  message.
- Has the ability to convert custom class <-> LineMessage.


#### AiBot
> AiBot communicates with api.ai.
- Has the ability to communicate with api.ai
- Has the ability to convert api.ai intent <-> custom intent obj.


#### EventHandler
> EventHandler converts non-ai message to intent
- Has the ability to convert postback action <-> custom intent obj.


#### IntentHandler 
- Has the ability to handle intent.
- Has the ability to create reply.


#### Intent
> An Intent is what user want to do.
> Intent shouldn't has any dependencies on line.
- Contains userId.
- Contains actionId.
- Contains detail datas.


#### Message 
> A Message is what linebot going to reply/push.
> Message shouldn't has any dependencies on line.
- Contains target. (user/room/group)
- Conatins type.(message / boilerplate)
- Contains context.




