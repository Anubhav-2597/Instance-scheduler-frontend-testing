import React from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Accordion, AccordionDetails, AccordionSummary, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table } from 'reactstrap';


class List extends React.Component{
    constructor(props){
        console.log("props",props);
        super(props)
        this.state={
            data:props.data1,
            checked: props.checked1,
            loading: {},
            scheduler: {},
        }
    }    

    fetchData = async () => {
        const { checked } = this.state
        let updatedList = [...checked]
        try {
            const result = await axios.post('http://127.0.0.1:8000/region_info/', { ...updatedList }).then(response=>
            {
                if (response?.data?.EC2) {
                    const { data: { EC2: data } } = response;
                    let loading = {};
                    let tempArray = []
                    Object.keys(data).forEach(region => {
                        const ec2List = data[region];
                        ec2List.map(ec2 => {
                            const instanceId = Object.keys(ec2)[0];
                            let instanceData = Object.values(ec2)[0];
                            instanceData = { ...instanceData, region, instanceId };
                            tempArray.push(instanceData)
                            // console.log(tempArray)
                        })
                    })               
                    console.log("tempArray",tempArray) ;
                    this.setState({ data: tempArray, loading: loading });
                    // this.setState({ regData: tempArray }); 
                    // console.log(data);
                    // <List data1 = {this.state.tempArray} />
                }  

            });
        } 
        
        catch(e) {
            console.error(e);
            // this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
        }
    }

    // componentDidMount(){
    //     console.log("componentDidMount called");
    //     this.fetchData();
    // }

    startInstance = async (instanceId, action, region) => {
        let data = {
            "instanceId": instanceId,
            "action": action,
            "region": region
          };
        console.log("data from start_instance",data);
        
        this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: true } }))
        try {
            console.log("axios called");
            const result = await axios.post('http://127.0.0.1:8000/list/', { ...data });
            if (result && result.status == '200') {
                this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
                this.fetchData();
            }
        } catch(e) {
            console.error(e);
            this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
        }
    }


    handleSchdeuleTime = (id, type) => (event) => {
        const { scheduler } = this.state
        if (!event?.target?.value) return null
        const { target: { value : time } } = event
        if (!scheduler[id]) scheduler[id] = {}
        scheduler[id] = { ...scheduler[id], [type]: time }
        this.setState({ scheduler }, () => console.log('eee ', scheduler))
    }

    updateScheduleInfo = async (id, region) => {
        // alert("instance region ")
        const { scheduler } = this.state
        if (!scheduler[id]) return null

        const payload = {
            instance_id: id,
            start_time: scheduler[id]?.start,
            stop_time: scheduler[id]?.stop,
            region: region
        }
        console.log("payload",payload);
        try {
            const result = await axios.post('http://127.0.0.1:8000/schedule_info/', { ...payload });
            if (result && result.status == '200') {
                // this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
                console.log("fetch data called from updateScheduleInfo");
                this.fetchData();
            }
        } catch(e) {
            console.error(e);
            // this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
        }
    }

    render(){
        const { loading, data: instData } = this.state;
        console.log("render called with instData",instData);
        const rows= instData.map((inst)=>
        <tr key={inst.instanceId}>
            <td>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                
                    <div style={{ width: '20%', textAlign:'center' }}>{inst.instanceId}</div>
                </AccordionSummary>
                <AccordionDetails>
                    <div>
                        <div>
                            Public IP: { inst.publicIp } 
                            {/* State: {inst.state} */}
                        </div>
                        { JSON.stringify(inst) }
                    </div>
                </AccordionDetails>
            </Accordion>
            </td>
            
            <td>
            <div style={{ width: '20%', paddingLeft:'4%' }}>{inst.state}</div>
            </td>

            <td>
            <div style={{ textAlign:'center' }}>{inst.region}</div>
            </td>

            <td> 
            <div style={{ width: '20%', textAlign:'center', paddingLeft:'2%' }}>

                { loading[inst.instanceId] ?  <CircularProgress size={ 30 }/> : inst.state == 'stopped' ?
                    <button type="button" className="btn btn-success" onClick={() => this.startInstance(inst.instanceId, "START", inst.region) }>
                        Start
                    </button> : inst.state == 'running' ? <button type="button" className="btn btn-danger"  onClick={() => this.startInstance(inst.instanceId, "STOP", inst.region) }>
                        Stop
                    </button> : <button type="button" className="btn btn-info" disabled>terminate</button>
                }
            </div>                
            </td>

            <td>
                <div>
                <p>Start time</p>
                {<input type="time" id="appt" name="appt" defaultValue={inst.ScheduleInfo.start_time} required onChange={ this.handleSchdeuleTime(inst.instanceId, 'start') }/>}
                <p>Stop time</p>
                {<input type="time" id="appt" name="appt" defaultValue={inst.ScheduleInfo.stop_time} required onChange={ this.handleSchdeuleTime(inst.instanceId, 'stop') }/>}
                <button onClick={ () => this.updateScheduleInfo(inst.instanceId, inst.region) }>Update</button>
                </div>
            </td>

        </tr>
        );
        return(
            // <table className="table table-bordered">
            <Table bordered>
                <thead>
                    <tr>
                        <th style={{ width: '20%', textAlign:'center' }}>Instance_Id</th>
                        <th style={{ width: '15%', textAlign:'center' }}>State</th>
                        <th style={{ width: '15%', textAlign:'center' }}>Region</th>
                        <th style={{ width: '20%', textAlign:'center' }}>Action</th>
                        <th style={{ width: '30%', textAlign:'center' }}>Schedule</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        );
    }
}
export default List;
