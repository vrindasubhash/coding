import streamlit as st
import requests

st.title("Framework Comparison: ReAct Style")

# Initialize session state for storing outputs
if 'outputs' not in st.session_state:
    st.session_state.outputs = {
        'crewai': '',
        'langchain_reAct': '',
        'llamaindex': '',
        'langchain_tools': ''
    }

question = st.text_input("Enter your question", "Which is greater: 2589113 * 7894 or 1894628 * 3581? or 199928 * 29991")

if st.button("Run All Frameworks"):
    for framework in ['crewai', 'langchain_reAct', 'llamaindex', 'langchain_tools']:
        response = requests.post("http://127.0.0.1:8000/query", json={"framework": framework, "question": question})
        if response.status_code == 200:
            st.session_state.outputs[framework] = response.json().get("output", "")
        else:
            st.session_state.outputs[framework] = f"Error: {response.text}"

# Create tabs for each framework
tab1, tab2, tab3, tab4 = st.tabs(["CrewAI ReAct Style", "LangChain ReAct", "LlamaIndex ReAct", "LangChain Tools"])

with tab1:
    st.text_area("CrewAI Output", st.session_state.outputs['crewai'], height=300)

with tab2:
    st.text_area("LangChain ReAct Output", st.session_state.outputs['langchain_reAct'], height=300)

with tab3:
    st.text_area("LlamaIndex Output", st.session_state.outputs['llamaindex'], height=300)

with tab4:
    st.text_area("LangChain Tools Output", st.session_state.outputs['langchain_tools'], height=300)
