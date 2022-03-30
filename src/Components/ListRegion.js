import React from "react";
import axios from "axios";
// import { InstallDesktop } from "@mui/icons-material";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from "./List";

class ListRegion extends React.Component{
    constructor(){
        super();
        this.state = {
            data: [],
            //regionList: false,
            checked: []
        }
    }

    // fetchData(){
    //     axios.get('http://127.0.0.1:8000/list/').then(response=>{
    //         if (response?.data?.EC2) {
    //             const { data: { EC2: data } } = response;
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
    //         } 
    //     });
    // }

    fetchRegion(){
        axios.get('http://127.0.0.1:8000/list/').then(response=>{
            if(response?.data?.EC2){
                const { data : { EC2: data } } = response;
                let tempArray = Object.keys(data)
                console.log(tempArray)

                this.setState({ data: tempArray }); 
            }
        })
    }

    componentDidMount(){
        this.fetchRegion();
    }

    handleRegionChange = (event) => {
        const { checked } = this.state
        // this.setState = ({[regionList]: event.target.checked});

        // const target = event.target;
        // const value = event.target.checked;
        // const name = target.name;

        // this.setState({
        //     [name]: value
        // });

        let updatedList = [...checked]
        if (event.target.checked) {
        updatedList = [...checked, event.target.value];
        } else {
        updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        this.setState({checked: updatedList});
        console.log(updatedList)
    }

    handleSubmit = async () => {
        const { checked } = this.state
        let updatedList = [...checked]
        try {
            const result = await axios.post('http://127.0.0.1:8000/region_info/', { ...updatedList }).then(response=>
            {
                if(response?.data?.EC2){
                    // const { data: { EC2: data } } = response
                    const data = response
                    console.log(data)
                    this.setState({
                        checked: [],
                        data: data
                    });
                    <List data1={this.state.data}/>
                }
            });
            // if (result && result.status == '200') {
            //     // this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
            //     // this.fetchData();
            //     // this.setState({checked: []});
            //     // <list funct={this.fetchData}/>
                
            // }
        } 
        
        catch(e) {
            console.error(e);
            // this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
        }
    }

    // handleRegionChange = (event) => {
    //     const [ regionList ] = this.state
    //     if (!event?.target?.value) return null
    //     const [region] = event
    //     regionList = [ ...regionList, region ]
    //     this.setState({ regionList: regionList }, () => console.log('eee ', regionList))
        
        // const target = event.target;
        // const value = target.checked;

        // this.setState({regionList: event.target.checked});
    

    // updateScheduleInfo = async (id) => {
    //     const { scheduler } = this.state
    //     if (!scheduler[id]) return null

    //     const payload = {
    //         instance_id: id,
    //         start_time: scheduler[id]?.start,
    //         stop_time: scheduler[id]?.stop
    //     }
    //     try {
    //         const result = await axios.post('http://127.0.0.1:8000/schedule_info/', { ...payload });
    //         if (result && result.status == '200') {
    //             // this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
    //             // this.fetchData();
    //         }
    //     } catch(e) {
    //         console.error(e);
    //         // this.setState(prev => ({ loading: { ...prev.loading, [instanceId]: false } }))
    //     }
    


    render(){

        const { data: instData } = this.state;
        const rows= instData.map((inst, index)=>
        <tr>          
            <td>     
            <div key={index}> 
                <form>
                    <label>
                        {inst}
                        <input 
                            value={inst}
                            type="checkbox"
                            //checked={this.state.regionList}
                            onChange={this.handleRegionChange}
                        />
                    </label>
                </form>
            </div> 
            </td>
        </tr>
    )    

        return(
            <div>
                
                <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>List of EC2 Regions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            <button onClick={this.handleSubmit}>Submit</button>
            </div>
            
        );
    }

}

export default ListRegion;

