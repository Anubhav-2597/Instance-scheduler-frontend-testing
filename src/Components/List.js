import React from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Accordion, AccordionDetails, AccordionSummary, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


class List extends React.Component{
    constructor(props){
        console.log("props",props.data1)
        super(props)
        this.state={
            data:props.data1,
            loading: {},
            scheduler: {},
        }
    }    

    // fetchData(){
    //     // axios.get('http://127.0.0.1:8000/list/').then(response=>{
    //     //     if (response?.data?.EC2) {
    //             const { data: { EC2: data } } = this.state.data;
    //             // const data = this.state
    //             let loading = {};
    //             let tempArray = []
    //             Object.keys(data).forEach(region => {
    //                 const ec2List = data[region];
    //                 ec2List.map(ec2 => {
    //                     const instanceId = Object.keys(ec2)[0];
    //                     let instanceData = Object.values(ec2)[0];
    //                     instanceData = { ...instanceData, region, instanceId };
    //                     tempArray.push(instanceData)
    //                     console.log(instanceData)
    //                 })
    //             })                
    //             this.setState({ data: tempArray, loading: loading }); 
    //     //     } 
    //     // });
    // }

    // componentDidMount(){
    //     this.fetchData();
    // }

    startInstance = async (instanceId, action, region) => {
        let data = {
            "instanceId": instanceId,
            "action": action,
            "region": region
          };
        
        this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: true } }))
        try {
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

    scheduleInfo = async (instanceId, starttm, stoptm) => {
        let schdata = {
            "instanceId": instanceId,
            "start_time": starttm,
            "stop_time": stoptm
        };


    }
    
    handleStartChange = (id, time) => {
        console.log(time)
        this.setState({time})
    }

    handleEndChange = (id) => (time) => {
        console.log(time)
        this.setState({time})
    }

    handleSchdeuleTime = (id, type) => (event) => {
        const { scheduler } = this.state
        if (!event?.target?.value) return null
        const { target: { value : time } } = event
        if (!scheduler[id]) scheduler[id] = {}
        scheduler[id] = { ...scheduler[id], [type]: time }
        this.setState({ scheduler }, () => console.log('eee ', scheduler))
    }

    updateScheduleInfo = async (id) => {
        const { scheduler } = this.state
        if (!scheduler[id]) return null

        const payload = {
            instance_id: id,
            start_time: scheduler[id]?.start,
            stop_time: scheduler[id]?.stop
        }
        try {
            const result = await axios.post('http://127.0.0.1:8000/schedule_info/', { ...payload });
            if (result && result.status == '200') {
                // this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
                // this.fetchData();
            }
        } catch(e) {
            console.error(e);
            // this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
        }
    }

    render(){
        const { loading, data: instData } = this.state;
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
                    <button type="button" className="btn btn-info" onClick={() => this.startInstance(inst.instanceId, "START", inst.region) }>
                        Start
                    </button> : <button type="button" className="btn btn-info"  onClick={() => this.startInstance(inst.instanceId, "STOP", inst.region) }>
                        Stop
                    </button>
                }
            </div>                
            </td>

            <td>
                <div>
                <p>Start time</p>
                {<input type="time" id="appt" name="appt" defaultValue={inst.start_time} required onChange={ this.handleSchdeuleTime(inst.instanceId, 'start') }/>}
                <p>Stop time</p>
                {<input type="time" id="appt" name="appt" defaultValue={inst.stop_time} required onChange={ this.handleSchdeuleTime(inst.instanceId, 'stop') }/>}
                <button onClick={ () => this.updateScheduleInfo(inst.instanceId) }>Update</button>
                </div>
            </td>

        </tr>
        );
        return(
            <table className="table table-bordered">
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
            </table>
        );
    }
}
export default List;