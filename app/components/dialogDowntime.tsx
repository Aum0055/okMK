'use client'
import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { supabase } from '@/lib/supabase/supabaseConnext';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useForm, SubmitHandler, Controller, Resolver } from "react-hook-form"
import Input from '@mui/joy/Input';

type DownTimeCodeType = {
    code: string;
    process: string;
    desc_th: string;
    desc_eng: string;
    desc_china: string;
    desc_vn: string;
    id: number;
    additional_detail: { detail: string }[]
}

type DownTimeFormType = {
    detail: string;
    reason: string;
    itemNumber: string;
    itemNumberOther: string;
    inputReason: string;
}

export const DialogDowntime = () => {
    const { handleSubmit, reset, setError, setValue, control, formState: { errors }, } = useForm<{ userId: string, password: string }>();
    const Form = useForm<DownTimeFormType>({
        defaultValues: {
            detail: "Placeholder",
            reason: "Placeholder",
            itemNumber: "Placeholder",
            itemNumberOther: "",
            inputReason: "",
        },
    });
    const [open, setOpen] = React.useState(false);
    const [openDowntime, setOpenDowntime] = React.useState(false);
    const [openQaAction, setOpenQaAction] = React.useState(false);
    const [detailDowntime, setDetailDowntime] = React.useState<string>('');
    const [detailDowntimeOther, setDetailDowntimeOther] = React.useState<string>('');
    const [itemNumber, setItemNumber] = React.useState<string>('Placeholder');
    const [downTimeCode, setDownTimeCode] = React.useState<DownTimeCodeType[]>([]);

    const otherAction = [
        "รอ part จากแผนก W/H",
        "รอ part จากแผนก INJ",
        "รอ part จากแผนก Paint",
        "รอ part จากแผนก Vac",
        "รอ part จากแผนก PC-Coat",
        "รอ part จาก Sup",
        "รอการแก้ไขจาก W/H",
        "รอการแก้ไขจาก INJ",
        "รอการแก้ไขจาก Paint",
        "รอการแก้ไขจาก Vac",
        "รอการแก้ไขจาก PC-Coat",
        "รอการแก้ไขจาก Sup"
    ];
    const ITEM_HEIGHT = 100;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const Groups = 'ASSY' /////////////////////////////////////////////////////////////////////////////////////////////////// local\

    React.useEffect(() => {
        const handleFetch = async () => {
            let data = await FetchProblem(Groups);
            if (data.data) {
                setDownTimeCode(data.data);
            }
        }
        handleFetch();
    }, []);

    const handleOpenNgDialog = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setDetailDowntime('');
        setDetailDowntimeOther('');
        Form.clearErrors();
        setOpen(false);
    }



    const handleOpenQaAction = () => {
        setOpenQaAction(true);
    }
    const handleCloseQaAction = () => {
        reset();
        setOpenQaAction(false);
    }

    const onSubmit: SubmitHandler<{ userId: string, password: string }> = (data) => {

    }

    const validateDownTime = (data: DownTimeFormType) => {
        const { detail, reason, itemNumber, itemNumberOther } = data;
        if (itemNumber === 'other' && itemNumberOther === '') {
            Form.setError('itemNumberOther', { type: "custom", message: "Please select item number other" })
            // setErrorHook({ ...errorHook, itemNumberOther: true });
            return false;
        }
        else if (detailDowntime === 'Z04') {
            if (detail === 'Placeholder' || reason === 'Placeholder' || itemNumber === 'Placeholder') {
                if (detail === 'Placeholder') {
                    // setErrorHook({ ...errorHook, detail: true });
                    Form.setError('detail', { type: "custom", message: "Please select detail" })
                }
                if (reason === 'Placeholder' ) {
                    // setErrorHook({ ...errorHook, reason: true });
                    Form.setError('reason', { type: "custom", message: "Please select reason" })
                }
                if (itemNumber === 'Placeholder'&& otherAction.includes(detailDowntimeOther)) {
                    // setErrorHook({ ...errorHook, itemNumber: true });
                    Form.setError('itemNumber', { type: "custom", message: "Please select item number" })
                }
                return false;
            }

        }
        else if (detail === 'Placeholder') {
            Form.setError('detail', { type: "custom", message: "Please select detail" })
            return false;
        }
        return true;
    }
    console.log(Form.formState.errors);

    const onSubmitDownTime: SubmitHandler<DownTimeFormType> = (data) => {
        console.log('onSubmitDownTime', data);

        if (validateDownTime(data)) {
            console.log('validateDownTime');

        }
    }

    const PorblemCode = () => {
        let data = downTimeCode && downTimeCode.filter((item) => item.code === detailDowntime);
        let text = data[0]?.desc_eng
        if (text) {
            return text;
        } else {
            return null;
        }
    }

    const handleDowntimeOther = () => {
        let data = downTimeCode && downTimeCode.filter(item => item.code === 'Z04');
        let dataOther = data[0]?.additional_detail;
        if (dataOther) {
            return dataOther;
        } else {
            return [];
        }
    }

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleOpenNgDialog}>
                Detail
            </Button>
            <Dialog
                fullWidth
                maxWidth='md'
                open={open}
                onClose={handleClose}
            >
                <div className=' max-h-[700px] overflow-y-auto py-8'>
                    <Container maxWidth='md' className=''>
                        <p className='text-3xl font-medium'>DownTime</p>
                        <p>Time pause : {'เวลา'}</p>
                        <form onSubmit={Form.handleSubmit(onSubmitDownTime)} className='space-y-4 mt-4'>
                            <div className='space-y-2'>
                                <p className={`${Form.formState.errors.detail ? 'text-red-500' : ''}`}>{Form.formState.errors.detail ? 'Detail : Please select detail' : 'Detail'} </p>
                                <Controller
                                    control={Form.control}
                                    name="detail"
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={field.value}
                                                onChange={(event) => {
                                                    field.onChange(event.target.value);
                                                    setDetailDowntime(event.target.value);
                                                }}
                                                className='h-11 w-full '
                                                MenuProps={MenuProps}
                                            >
                                                <MenuItem disabled value="Placeholder">
                                                    <em className='text-gray-500'>Placeholder </em>
                                                </MenuItem>
                                                {downTimeCode && downTimeCode.map(item => {
                                                    return (
                                                        <MenuItem key={item.code} value={item.code}>{item.code} {item.desc_th}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </>
                                    )}
                                />
                            </div>
                            {detailDowntime === 'Z04' ?
                                <div className='space-y-2'>
                                    <p className={`${Form.formState.errors.reason ? 'text-red-500' : ''}`}>{Form.formState.errors.reason ? 'Reason : Please select reason' : 'Reason'} </p>
                                    <Controller
                                        control={Form.control}
                                        name="reason"
                                        render={({ field }) => (
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={field.value}
                                                onChange={(event) => {
                                                    field.onChange(event.target.value);
                                                    setDetailDowntimeOther(event.target.value);
                                                }}
                                                className='h-11 w-full '
                                                MenuProps={MenuProps}
                                            >
                                                <MenuItem disabled value="Placeholder">
                                                    <em className='text-gray-500'>Placeholder </em>
                                                </MenuItem>
                                                {handleDowntimeOther() ? handleDowntimeOther().map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={item.detail}>{item.detail}</MenuItem>
                                                    )
                                                }) : null}
                                            </Select>
                                        )}
                                    />
                                </div>
                                :
                                null
                            }
                            {otherAction.includes(detailDowntimeOther) ?
                                <>
                                    <div className={`grid ${itemNumber === 'other' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 items-end`}>
                                        <div>
                                            <p className={`${Form.formState.errors.itemNumber ? 'text-red-500' : ''}`}>{Form.formState.errors.itemNumber ? 'Item number : Please select item number' : 'Item number'} </p>
                                            <Controller
                                                control={Form.control}
                                                name="itemNumber"
                                                render={({ field }) => (
                                                    <Select
                                                        labelId="demo-select-small-label"
                                                        id="demo-select-small"
                                                        value={field.value}
                                                        onChange={(event) => {
                                                            field.onChange(event.target.value);
                                                            setItemNumber(event.target.value);
                                                        }}
                                                        className='h-11 w-full '
                                                        MenuProps={MenuProps}
                                                    >
                                                        <MenuItem disabled value="Placeholder">
                                                            <em className='text-gray-500'>Placeholder </em>
                                                        </MenuItem>
                                                        {['item'].map((item, index) => {
                                                            return (
                                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                                            )
                                                        })}
                                                        <MenuItem value='other'>Other</MenuItem>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                        {itemNumber === 'other' ?
                                            <div>
                                                <p className={`${Form.formState.errors.itemNumberOther ? 'text-red-500' : ''}`}>{Form.formState.errors.itemNumberOther ? 'Item number other : Please select item number other' : 'Item number other'} </p>
                                                <Controller
                                                    control={Form.control}
                                                    name="itemNumberOther"
                                                    render={({ field }) => (
                                                        <Input type='text' placeholder='Placeholder' {...field} className='h-11 border-gray-300 rounded' />
                                                    )}
                                                />
                                            </div>

                                            :
                                            null
                                        }

                                    </div>
                                    <div>
                                        <p>Input Reason</p>
                                        <Controller
                                            control={Form.control}
                                            name="inputReason"
                                            render={({ field }) => (
                                                <Input type='text' placeholder='Placeholder' {...field} className='h-11 border-gray-300 rounded' />
                                            )}
                                        />
                                    </div>
                                </>
                                :
                                null
                            }
                            <div className='mt-4 space-y-2'>
                                {detailDowntime === 'H' ? < DownTimeCode_H /> : null}


                            </div>
                            <div className='flex justify-center space-x-28 mt-4'>
                                <button type='submit' className='transition rounded-md h-12 px-6 text-lg text-white  bg-green-500 hover:bg-green-700 drop-shadow-md'>
                                    Submit
                                </button>
                                <button type='button' className='transition rounded-md h-12 px-6 text-lg text-white  bg-red-500 hover:bg-red-700 drop-shadow-md' onClick={handleClose}>
                                    Close
                                </button>
                            </div>

                        </form>























                        {/* <div className='mt-4'>


                            {detailDowntime === 'Z04' ?
                                <div className='space-y-2'>
                                    <p className={`${detailDowntimeOtherError ? 'text-red-500' : ''}`}>{detailDowntimeOtherError ? 'Detail : Please select detail other' : 'Detail'} </p>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={detailDowntimeOther}
                                        onChange={(event) => {
                                            setDetailDowntimeOther(event.target.value);
                                            setDetailDowntimeOtherError(false);
                                        }}
                                        className='h-11 w-full '
                                        MenuProps={MenuProps}
                                    >
                                        <MenuItem disabled value="Placeholder">
                                            <em className='text-gray-500'>Placeholder </em>
                                        </MenuItem>
                                        {handleDowntimeOther() ? handleDowntimeOther().map((item, index) => {
                                            return (
                                                <MenuItem key={index} value={item.detail}>{item.detail}</MenuItem>
                                            )
                                        }) : null}
                                    </Select>
                                </div>
                                :
                                null
                            }

                            {otherAction.includes(detailDowntimeOther) ?
                                <>
                                    <div className={`grid ${itemNumber === 'other' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                        <div>
                                            <p>Item number</p>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={itemNumber}
                                                onChange={(event) => {
                                                    setItemNumber(event.target.value);
                                                }}
                                                className='h-11 w-full '
                                                MenuProps={MenuProps}
                                            >
                                                <MenuItem disabled value="Placeholder">
                                                    <em className='text-gray-500'>Placeholder </em>
                                                </MenuItem>
                                                {['item'].map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                                    )
                                                })}
                                                <MenuItem value='other'>Other</MenuItem>
                                            </Select>

                                        </div>
                                        {itemNumber === 'other' ?
                                            <div>
                                                <p>Item number other</p>
                                                <Input type='text' placeholder='Placeholder' className='h-11 border-gray-300 rounded' />
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                    <div>
                                        <p>Input Reason</p>
                                        <Input type='text' placeholder='Placeholder' className='h-11 border-gray-300 rounded' />
                                    </div>
                                </>
                                :
                                null
                            }





                        </div> */}
                        {/* <div className='mt-4 space-y-2'>
                            {detailDowntime === 'H' ? < DownTimeCode_H /> : null}


                        </div>
                        <div className='flex justify-center space-x-28 mt-4'>
                            <button type='submit' className='transition rounded-md h-12 px-6 text-lg text-white  bg-green-500 hover:bg-green-700 drop-shadow-md'>
                                Submit
                            </button>
                            <button type='button' className='transition rounded-md h-12 px-6 text-lg text-white  bg-red-500 hover:bg-red-700 drop-shadow-md' onClick={handleClose}>
                                Close
                            </button>
                        </div> */}
                    </Container>
                </div>
            </Dialog>
            <Dialog
                fullWidth
                maxWidth='md'
                open={openDowntime}
            >
                <div className='max-h-[500px] overflow-y-auto py-8'>
                    <Container maxWidth='md' className=''>
                        <p className='text-4xl font-medium mb-4'>DownTime</p>
                        <p className='text-lg'>please push start when end of dewntime</p>
                        <p className='text-lg'>Detail : <PorblemCode /> {detailDowntimeOther ? detailDowntimeOther : null}  </p>
                        <div className='mt-4 flex flex-col items-center'>
                            <p className='text-2xl font-medium'>Timer Downtime</p>
                            <div className='p-8'>
                                <p className='text-3xl font-medium'>time</p>
                            </div>
                            <p className='text-lg'>Renning</p>
                        </div>
                        <div className='flex justify-center mt-8'>
                            <button type='button' className='transition rounded-md h-14 text-lg px-8 text-white  bg-green-500 hover:bg-green-700 drop-shadow-md' onClick={handleOpenQaAction}>
                                QA Action
                            </button>
                        </div>
                    </Container>
                    <Dialog
                        fullWidth
                        maxWidth='sm'
                        open={openQaAction}
                        onClose={handleCloseQaAction}
                    >
                        <div className='max-h-[500px] overflow-y-auto py-8'>
                            <Container maxWidth='md' className=''>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <p className='text-2xl font-medium mb-4'>QA Login action</p>
                                    <div className='flex gap-4'>
                                        <div className='w-full space-y-1'>
                                            <p>User id</p>
                                            <Controller
                                                control={control}
                                                name="userId"
                                                render={({ field }) => (
                                                    <input type="text" {...field} className='h-10 px-2 border border-gray-400 rounded w-full' placeholder='User id' />
                                                )}
                                            />

                                        </div>
                                        <div className='w-full space-y-1'>
                                            <p>Password</p>
                                            <Controller
                                                control={control}
                                                name="password"
                                                render={({ field }) => (
                                                    <input type="password" {...field} className='h-10 px-2 border border-gray-400 rounded w-full' placeholder='Password' />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex justify-center space-x-28 mt-8' >
                                        <button type='button' className='transition rounded-md h-10 px-6 text-white   bg-green-500 hover:bg-green-700 drop-shadow-md' >
                                            Submit
                                        </button>
                                        <button type='button' className='transition rounded-md h-10 px-6  text-white  bg-red-500 hover:bg-red-700 drop-shadow-md' onClick={handleCloseQaAction}>
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </Container>
                        </div>
                    </Dialog>


                </div>
            </Dialog>
        </React.Fragment >
    )
}

type dataCodeHType = {
    id: string;
    reasonEn: string;
    reasonTh: string;
    itemNumber: string;
    itemQty: number;
}

type InputAddItem = {
    reason: string;
    itemNumber: string;
    qty: number;
    itemNumberOther: string;
}
type provlemCodeType = {
    id: number;
    Reason_en: string;
    Reason_th: string;
    Reason_cn: string;
    Reason_vn: string;
}
const DownTimeCode_H = () => {
    const { handleSubmit, reset, setError, setValue, control, formState: { errors }, } = useForm<InputAddItem>();
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [itmeOther, setItemOther] = React.useState<string | null>(null);
    const [idDelete, setIdDelete] = React.useState<string | null>(null);
    const [dataCodeH, setDataCodeH] = React.useState<dataCodeHType[] | null>(null);
    const [problemCode, setProblemCode] = React.useState<provlemCodeType[] | null>(null);
    const ITEM_HEIGHT = 100;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const handleOpenNgDialog = async () => {
        setValue('reason', 'Placeholder')
        setValue('itemNumber', 'Placeholder')
        setValue('qty', 0)
        setValue('itemNumberOther', '')
        setOpen(true);
        let dataProblemCode = await FetchProblemCode();
        setProblemCode(dataProblemCode.data);
        setDataCodeH([{ id: '1', reasonEn: 'sss', reasonTh: 'ะำหะ', itemNumber: 'test', itemQty: 10 },
        { id: '2', reasonEn: 'sss', reasonTh: 'ะำหะ', itemNumber: 'test', itemQty: 10 },
        { id: '3', reasonEn: 'sss', reasonTh: 'ะำหะ', itemNumber: 'test', itemQty: 10 },
        { id: '4', reasonEn: 'sss', reasonTh: 'ะำหะ', itemNumber: 'test', itemQty: 10 },
        { id: '5', reasonEn: 'sss', reasonTh: 'ะำหะ', itemNumber: 'test', itemQty: 10 }
        ])
    }

    const handleClose = () => {
        reset();
        setItemOther(null);
        setOpen(false);
    }
    const handleCloseDelete = () => {
        setOpenDelete(false);
    }

    const validate = (data: InputAddItem) => {
        const { reason, itemNumber, qty, itemNumberOther } = data;
        if (reason === 'Placeholder' || itemNumber === 'Placeholder' || qty === 0) {
            if (reason === 'Placeholder') {
                setError('reason', { type: "custom", message: "Please select reason" })
            }
            if (itemNumber === 'Placeholder') {
                setError('itemNumber', { type: "custom", message: "Please select  item number" })
            }
            if (qty === 0) {
                setError('qty', { type: "custom", message: "Please select qty" })
            }
            return false;
        }
        else if (itemNumber === 'other' && itemNumberOther === '') {
            setError('itemNumberOther', { type: "custom", message: "Please select item number other" })
            return false;
        }
        return true;
    }

    const onSubmit: SubmitHandler<InputAddItem> = (data) => {
        if (validate(data)) {
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    }

    const deleteItem = (id: string) => {
        // let dataNew = dataCodeH?.filter((item) => item.id !== id);
        // if (dataNew) {
        //     setDataCodeH(dataNew);
        // }
        setIdDelete(id);
        setOpenDelete(true);
    }

    const handleDeleteItem = () => {
        idDelete
        let dataNew = dataCodeH?.filter((item) => item.id !== idDelete);
        if (dataNew) {
            setDataCodeH(dataNew);
        }
        setOpenDelete(false);
    }

    return (
        <>
            <div className='flex justify-end '>
                <button className='transition rounded-md h-10 px-4 text-white  bg-blue-500 hover:bg-blue-700 drop-shadow-md' onClick={handleOpenNgDialog}>
                    Add item
                </button>
            </div>
            <Paper>
                <div className='flex justify-center'>
                    <p className='text-xl font-medium'>Item Downtime Quality Problem</p>
                </div>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
                                <TableCell><p className='border-r-2'>ID</p></TableCell>
                                <TableCell align="right" ><p className='border-r-2 px-2'>Reason en</p></TableCell>
                                <TableCell align="right"><p className='border-r-2 px-2'>Reason th</p></TableCell>
                                <TableCell align="right"><p className='border-r-2 px-2'>Item number</p></TableCell>
                                <TableCell align="right"><p className='border-r-2 px-2'>Item qty</p></TableCell>
                                <TableCell align="right"><p className='border-r-2 px-2'>Delete</p></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className='h-32  overflow-auto'>
                            {dataCodeH ? dataCodeH.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row"> {row.id}</TableCell>
                                    <TableCell align="right" className='px-4'>{row.reasonEn}</TableCell>
                                    <TableCell align="right" className='px-4'>{row.reasonTh}</TableCell>
                                    <TableCell align="right" className='px-4'>{row.itemNumber}</TableCell>
                                    <TableCell align="right" className='px-4'>{row.itemQty}</TableCell>
                                    <TableCell align="right" className='px-4'><button onClick={() => deleteItem(row.id)}><DeleteIcon /> </button></TableCell>

                                </TableRow>
                            )) :
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className='flex flex-col items-center'>
                                            <svg width="150" height="150" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg">
                                                <g fill="none" fill-rule="evenodd">
                                                    <g transform="translate(24 31.67)">
                                                        <ellipse fill-opacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse>
                                                        <path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2"></path>
                                                        <path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#linearGradient-1)" transform="translate(13.56)"></path>
                                                        <path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7"></path>
                                                        <path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6"></path></g>
                                                    <path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6"></path>
                                                    <g transform="translate(149.65 15.383)" fill="#FFF">
                                                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse>
                                                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path>
                                                    </g>
                                                </g>
                                            </svg>
                                            <p>No data</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Dialog
                fullWidth
                maxWidth='sm'
                open={open}
                onClose={handleClose}
            >
                <div className=' max-h-screen overflow-y-auto py-4'>
                    <Container maxWidth='sm' className=''>
                        <p className='text-3xl font-medium mb-6'>Item Downtime Quality Problem</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='space-y-2'>
                                <div className='space-y-1'>
                                    <p className={`${errors.reason ? 'text-red-500' : ''}`}>{errors.reason?.message ? `Reason : ${errors.reason?.message}` : 'Reason'} </p>
                                    <Controller
                                        control={control}
                                        name="reason"
                                        render={({ field }) => (
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={field.value}
                                                onChange={(event) => {
                                                    field.onChange(event.target.value)
                                                }}
                                                className='h-11 w-full '
                                                MenuProps={MenuProps}

                                            >
                                                <MenuItem disabled value="Placeholder">
                                                    <em className='text-gray-500'>Placeholder </em>
                                                </MenuItem>
                                                {problemCode && problemCode.map(item => {
                                                    return (
                                                        <MenuItem key={item.id} value={item.id}>{item.id} {item.Reason_th}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className={`grid ${itmeOther === 'other' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 items-end`}>
                                    <div className='space-y-1'>
                                        <p className={`${errors.itemNumber ? 'text-red-500' : ''}`}>{errors.itemNumber?.message ? `Item number : ${errors.itemNumber?.message}` : 'Item number'} </p>
                                        <Controller
                                            control={control}
                                            name="itemNumber"
                                            render={({ field }) => (
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    value={field.value}
                                                    onChange={(event) => {
                                                        field.onChange(event.target.value);
                                                        setItemOther(event.target.value);
                                                    }}
                                                    className='h-11 w-full '
                                                    MenuProps={MenuProps}

                                                >
                                                    <MenuItem disabled value="Placeholder">
                                                        <em className='text-gray-500'>Placeholder </em>
                                                    </MenuItem>
                                                    <MenuItem value="other">
                                                        Other
                                                    </MenuItem>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    {itmeOther === 'other' ?
                                        <div className='space-y-1'>
                                            <p className={`${errors.itemNumberOther ? 'text-red-500' : ''}`}>{errors.itemNumberOther?.message ? `Item number : ${errors.itemNumberOther?.message}` : 'Item number other'} </p>
                                            <Controller
                                                control={control}
                                                name="itemNumberOther"
                                                render={({ field }) => (
                                                    <Input type='text' placeholder='Placeholder' {...field} className='h-11' />
                                                )}
                                            />
                                        </div>
                                        : null


                                    }

                                </div>

                                <div className='space-y-1'>
                                    <p className={`${errors.qty ? 'text-red-500' : ''}`}>{errors.qty?.message ? `Qty : ${errors.qty?.message}` : 'Qty'} </p>
                                    <Controller
                                        control={control}
                                        name="qty"
                                        render={({ field }) => (
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={field.value}
                                                onChange={(event) => {
                                                    field.onChange(event.target.value)
                                                }}
                                                className='h-11 w-full '
                                                MenuProps={MenuProps}

                                            >
                                                <MenuItem disabled value={0}>
                                                    <em className='text-gray-500'>0 </em>
                                                </MenuItem>
                                                <MenuItem value={1}>
                                                    1
                                                </MenuItem>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className='flex justify-center space-x-28 mt-4'>
                                <button type='submit' className='transition rounded-md h-12 px-6 text-lg text-white  bg-green-500 hover:bg-green-700 drop-shadow-md'>
                                    Submit
                                </button>
                                <button type='button' className='transition rounded-md h-12 px-6 text-lg text-white  bg-red-500 hover:bg-red-700 drop-shadow-md' onClick={handleClose}>
                                    Close
                                </button>
                            </div>
                        </form>
                    </Container>
                </div>
            </Dialog>
            <Dialog
                fullWidth
                maxWidth='sm'
                open={openDelete}
                onClose={handleCloseDelete}
            >
                <div className=' max-h-screen overflow-y-auto py-4'>
                    <Container maxWidth='sm' className=''>
                        <p className='text-xl'>Do you want to delete the item?</p>
                        <div className='flex justify-center space-x-28 mt-4'>
                            <button type='button' className='transition rounded-md h-10 px-6 text-black  border border-blue-500 hover:border-blue-700 drop-shadow-md' onClick={handleCloseDelete}>
                                Close
                            </button>
                            <button type='button' className='transition rounded-md h-10 px-6  text-white  bg-red-500 hover:bg-red-700 drop-shadow-md' onClick={handleDeleteItem}>
                                Delete
                            </button>
                        </div>


                    </Container>
                </div>
            </Dialog>

        </>
    )
}




export const FetchProblemCode = async () => {

    let { data, error } = await supabase
        .from('problem_quality_code')
        .select('*')
        .order('id')

    if (error) {
        return {
            error,
            data: null
        }
    } else {
        return {
            error: null,
            data: data || []
        }
    }
}




export const FetchProblem = async (text: string) => {
    let { data, error } = await supabase
        .from('DownTimeCode')
        .select('*')
        .in('process', ['COMMON', text])
        .order('code')

    if (error) {
        return {
            error,
            data: null
        }
    } else {
        return {
            error: null,
            data: data || []
        }
    }
}