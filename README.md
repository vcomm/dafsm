# Dynamic attachment finite state machine 
This engine for coding automate programming paradigm 

# Introduction

In recent years great attention has been paid to the development of the technology of programming for the embedded systems and real-time systems. These systems have special requirements for the quality of software. One of the most well known approaches for this field of tasks is synchronous programming.
Simultaneously with the progress of synchronous programming in Europe, an approach, called “automata-based programming” or “state-based programming” is being created. This method could be considered as a type of synchronous programming.

The term event in the programming has been used wider and wider in programming. It has become one of the main terms in software development. The offered approach is based on the term “state”. After introduction of the term “input action”, which could be an input variable or an event, the term “automaton without outputs” could be brought in. After addition of the term “output action”, the term “automaton” could be brought in. It is the finite determined automaton.

The feature of this approach is that automata, used for developing, are defined with the help of transition graphs. For distinguishing of the nodes of these graphs the term “state coding” is to be introduced. When using “multiple state coding” with the help of single variable it is possible to distinguish amount of states which is equal to the amount of variables values. This allows to introduce in programming the term “program observability”. Using the offered approach, programming is to be performed using the concept of “state”, not the concept of “flag variables”. It allows to understand and specify the task and its parts (subtasks)  better.

# State-Based Programming

Henceforth automata approach was spread to the event-based (reactive) systems. In systems of this kind all limitations, mentioned above are taken away. It is obvious from the name of these systems that events are used among the input actions. Role of output actions could be played by arbitrary functions. Any real-time operating system could be used as an environment.

For programming for event-based systems with the help of automata a procedural approach to software developing was used. So this king of programming was called as “state-based programming”.

Using this method output actions are assigned to the arcs, loops or nodes of the transition graphs (mixed automata are to be used – Moore-Mealy automata). This allows to present sequences of actions, which are reactions to the corresponding input actions, in the compact form.

On of the features of programming for the reactive systems is that liquidation of logic in the event handlers and forming of system of interacting automata, which are called from these handlers, causes logic centralization. Automata in such system can interact by nesting, by calling ability and with the help of state numbers interchange.
Last type of interaction is described in work, which declares that “this type of interaction may be used as powerful tool for program verification”.

System of interconnected automata forms system-independent part of software. At the same time system-dependent part is formed by functions of input and output actions, event handlers and so on.
Another important feature of this approach is that automata in it are used thrice: for specification, for implementation (they stay in the source code) and for drawing up the protocol, which is performed, as said above, in terms of automata.
Last property allows to verify the propriety of automata system functioning. Logging is performed automatically, it is based on the created program. This mechanism could be also used for large scale tasks and for task with difficult, smeared software logic.

The composite approach may be rather useful for solving task from a very large spectrum, it is based on object-oriented and automata-based programming paradigms. In work this method was called as “state-based object-oriented programming”.

# The Basic Finite State Machine Theory Introduction.

A Finite State Machine (FSM) is the representation of a system in terms of its states and events.  A state is simply a decision point at the system level , and an event is a stimulus that causes a state transition within the system. Therefore , a state machine stays in the current state until n event is received causing a state transition. If the state to transition to is the current state, a new state is not entered event though a state transition occurs.

Mealy and Moore

Two well known types of state machine are the Mealy and Moore machines. The difference between these state machines is their output. The output of the Mealy state machine depends on the received event, while the output of the Moore state machine does not. 
The functions defining the Moore state machine at transition t are:
	S(t+1) = Function (S(t),I(t))
	O(t+1) = Function (S(t))
The functions defining the Mealy state machine at transition t are:
	S(t+1) = Function (S(t),I(t))
	O(t+1) = Function (S(t),I(t))
While the state transition function S is same for both states machine, the output function O is different. The output of the Moore machine depends solely on the current state, while the output of the Mealy machine depends on both the current state and input.

