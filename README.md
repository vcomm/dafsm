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

Deterministic and Non- Deterministic.

In a state transition diagram, if  no two outgoing edges of a state have the same label, then the corresponding machine is called a deterministic finite state machine …if two or more outgoing edges of a state have the same label, then it is called a non-deterministic finite state machine.

# Benefits of using Finite State Machines.

Some of the benefits of using Finite State Machines (FSMs) include early detection of design flaws, increased reusability, parallel module implementation, and easier module integration and testing. The increasing complexity of software over the past few years has led to implementing the “heart” of the software as an FSM. The FSM approach is most widely used today in more complex software systems which must conform to a given protocol or standard. “Other possible uses of FSMs include: the implementation of compilers and other language processing tools; communication systems, such as the modeling of network protocols and the interpretation of escape  charter sequences in terminal emulators, and the design of interactive user interface ”. Developing software using an FSM approach also encourages highly cohesive and loosely coupled software modules.

State Diagram Notation (Graph)

State diagrams (also called State Chart diagrams) are used to help the developer better understand any complex/unusual functionalities or business flows of specialized areas of the system. In short, State diagrams depict the dynamic behavior of the entire system, or a sub-system, or even a single object in a system. This is done with the help of Behavioral elements.


Analytical Notation

S0 [W0] = { S1(X01/Y01)[V0] }

S1 [W1] = { S0(X10/Y10)[V0], S2(X12/Y12)[V2], S3(X13/Y13)[V3] }

S2 [W2] = { S0(X20/Y20)[V0], S4(X24/Y24)[V4] }

S3 [W3] = { S2(X32/Y32)[V2], S3(X33/Y33)[V3] }

S4 [W4] = { S0(X40/Y40)[V0], S3(X43/Y43)[V3] }

 There are several action types:
Entry action - V
which is performed when entering the state 
Exit action  - W
which is performed when exiting the state 
Input action - X
which is performed depending on present state and input conditions 
Transition action - Y
which is performed when performing a certain transition 


Algorithmic State Machine Notation (Block-Scheme)

You have already seen how to describe finite state machines in terms of state diagrams and tables. However, it can be difficult to describe complex finite state machines in this way. Recently, hardware designers have shifted toward using alternative representations of FSM behavior that look more like software descriptions. In this section, we introduce algorithmic state machine (ASM) notation. ASMs are similar to program flowcharts, but they have a more rigorous concept of timing. 

You may wonder what is wrong with state diagrams. The problem is that they do not adequately capture the notion of an algorithm-a well-defined sequence of steps that produce a desired sequence of actions based on input data. State diagrams are weak at capturing the structure behind complex sequencing. The representations discussed next do a better job of making this sequencing structure explicit.
















