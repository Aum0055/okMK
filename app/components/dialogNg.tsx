'use client'
import * as React from 'react';
import { useForm, SubmitHandler } from "react-hook-form"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Input from '@mui/joy/Input';
import Container from '@mui/material/Container';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type Inputs = {
    case: string;
    other: string;
    qtyNg: number;
    past: string;
    pastother: string;

}

export default function NgDialog() {
    const { register, handleSubmit, clearErrors, reset ,setError, setValue, formState: { errors }, } = useForm<Inputs>();
    const [open, setOpen] = React.useState(false);
    const [qtyWO, setQtyWO] = React.useState<number>(100);
    const [qtyNg, setQtyNg] = React.useState<number>(0);
    const [caseNg, seCaseNg] = React.useState<string>('Placeholder');
    const [past, setPast] = React.useState<string>('Placeholder');
    const [otherCheck, setotherCheck] = React.useState<boolean>(false);
    const [otherCheckPast, setotherCheckPast] = React.useState<boolean>(false);
    const [saveCheck, setSaveCheck] = React.useState<boolean>(false);

    const qtyWOArray = Array.from({ length: qtyWO + 1 }, (_, index) => index);

    const validate = (data: Inputs) => {
        if (data.case === 'Placeholder') {
            setError('case', { type: 'required', message: 'กรุณากรอกข้อมูล input' });
            return false;
        } else if (data.qtyNg == 0) {
            setError('qtyNg', { type: 'required', message: 'กรุณากรอกข้อมูล Ng' });
            return false;
        } else if (otherCheck && data.other === '') {
            setError('other', { type: 'required', message: 'กรุณากรอกข้อมูล input' });
            return false;
        } else if (otherCheckPast && data.pastother === '') {
            setError('pastother', { type: 'required', message: 'กรุณากรอกข้อมูล input' });
            return false;
        } else if (otherCheck && data.past === 'Placeholder') {
            setError('past', { type: 'required', message: 'กรุณากรอกข้อมูล input' });
            return false;
        }
        return true;
    }
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

    let caseNgData = [
        {
            "id": 1,
            "process": "ASSY",
            "code": "A",
            "desc_th": "แตก",
            "desc_eng": "Broken",
            "desc_china": "破裂",
            "desc_vn": "Hỏng"
        },
        {
            "id": 2,
            "process": "ASSY",
            "code": "B",
            "desc_th": "น้ำมัน",
            "desc_eng": "Oil",
            "desc_china": "油污",
            "desc_vn": "Dầu"
        },
        {
            "id": 3,
            "process": "ASSY",
            "code": "C",
            "desc_th": "โก่งงอ",
            "desc_eng": "Bent",
            "desc_china": "变形",
            "desc_vn": "Cong vênh"
        },
        {
            "id": 4,
            "process": "ASSY",
            "code": "D",
            "desc_th": "จุดดำ",
            "desc_eng": "Black dot",
            "desc_china": "黑点",
            "desc_vn": "Điểm đen"
        },
        {
            "id": 6,
            "process": "ASSY",
            "code": "F",
            "desc_th": "เยิ้ม",
            "desc_eng": "Filmy",
            "desc_china": "垂流",
            "desc_vn": "\"Sương trắng\""
        },
        {
            "id": 7,
            "process": "ASSY",
            "code": "G",
            "desc_th": "ขีดข่วน",
            "desc_eng": "Scratch",
            "desc_china": "刮伤",
            "desc_vn": "Trầy xước"
        },
        {
            "id": 9,
            "process": "ASSY",
            "code": "I",
            "desc_th": "ฟองอากาศ",
            "desc_eng": "Bubble",
            "desc_china": "气泡",
            "desc_vn": "Bong tróc"
        },
        {
            "id": 10,
            "process": "ASSY",
            "code": "J",
            "desc_th": "ฉีดไม่เต็ม",
            "desc_eng": "Feed not full",
            "desc_china": "射不饱",
            "desc_vn": "Không đầy đủ vật liệu"
        },
        {
            "id": 11,
            "process": "ASSY",
            "code": "K",
            "desc_th": "เม็ดฝุ่น",
            "desc_eng": "Gain of dust",
            "desc_china": "砂粒",
            "desc_vn": "Lấy bụi"
        },
        {
            "id": 12,
            "process": "ASSY",
            "code": "L",
            "desc_th": "สีผิด",
            "desc_eng": "Wrong color",
            "desc_china": "色差",
            "desc_vn": "Màu sai"
        },
        {
            "id": 13,
            "process": "ASSY",
            "code": "M",
            "desc_th": "ซ่อมงานเสีย",
            "desc_eng": "Rework NG",
            "desc_china": "整修不良品",
            "desc_vn": "Làm lại không đạt"
        },
        {
            "id": 14,
            "process": "ASSY",
            "code": "N",
            "desc_th": "เครื่อง Error",
            "desc_eng": "Machine error",
            "desc_china": "机器故障",
            "desc_vn": "Lỗi máy"
        },
        {
            "id": 15,
            "process": "ASSY",
            "code": "O",
            "desc_th": "ไหม้เหลือง",
            "desc_eng": "Yellow of burn",
            "desc_china": "焦黄",
            "desc_vn": "Vết vàng đốt"
        },
        {
            "id": 16,
            "process": "ASSY",
            "code": "P",
            "desc_th": "เส้นขน",
            "desc_eng": "Hair",
            "desc_china": "棉絮",
            "desc_vn": "Tóc"
        },
        {
            "id": 17,
            "process": "ASSY",
            "code": "Q",
            "desc_th": "งานไม่ครบ",
            "desc_eng": "Part not complete",
            "desc_china": "零件不足",
            "desc_vn": "Bộ phận chưa hoàn thành"
        },
        {
            "id": 18,
            "process": "ASSY",
            "code": "R",
            "desc_th": "ไฟไม่ติด",
            "desc_eng": "Electrical system failed",
            "desc_china": "灯不亮",
            "desc_vn": "Hệ thống điện bị lỗi"
        },
        {
            "id": 19,
            "process": "ASSY",
            "code": "S",
            "desc_th": "ชิ้นงานแหว่ง",
            "desc_eng": "Chipped of part",
            "desc_china": "零件凹型",
            "desc_vn": "Bị vỡ mảnh"
        },
        {
            "id": 20,
            "process": "ASSY",
            "code": "T",
            "desc_th": "งานไม่ติด",
            "desc_eng": "Part is not stuck",
            "desc_china": "底座与灯壳不熔合",
            "desc_vn": "Bộ phận không được dính chặt"
        },
        {
            "id": 21,
            "process": "ASSY",
            "code": "U",
            "desc_th": "รอยประสาน",
            "desc_eng": "Traces of merge",
            "desc_china": "接合线",
            "desc_vn": "Vết nối"
        },
        {
            "id": 22,
            "process": "ASSY",
            "code": "V",
            "desc_th": "รอยโมลด์",
            "desc_eng": "Traces of mold",
            "desc_china": "模痕",
            "desc_vn": "Vết nấm mốc"
        },
        {
            "id": 5,
            "process": "ASSY",
            "code": "E",
            "desc_th": "ฝ้าขาว",
            "desc_eng": "White frosted",
            "desc_china": "白雾",
            "desc_vn": "Mờ"
        },
        {
            "id": 8,
            "process": "ASSY",
            "code": "H",
            "desc_th": "แวคไม่เต็ม",
            "desc_eng": "Vac is not full",
            "desc_china": "缺镀",
            "desc_vn": "\"Hộp chưa đầy\""
        }
    ]

    const handleOpenNgDialog = () => {
        setValue('case', 'Placeholder');
        setValue('other', '');
        setValue('qtyNg', 0);
        setValue('past', 'Placeholder');
        setValue('pastother', '');

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        clearErrors();
        reset();
        seCaseNg('Placeholder');
        setPast('Placeholder');
        setQtyNg(0);
    };


    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setSaveCheck(true);
        if (validate(data)) {
            console.log('onSubmit', data)
        }
        // setTimeout(() => {
        //     setSaveCheck(false);
        // }, 3000);
        setSaveCheck(false);
    }

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleOpenNgDialog}>
                Ng order
            </Button>
            <Dialog
                fullScreen
                open={open}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Container maxWidth='sm' className='space-y-4 mt-4'>
                        <div>
                            <p className={`mb-1 ${errors.case && 'text-red-500'}`}>Case ng {errors.case?.message} </p>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={caseNg}
                                onChange={(event) => {
                                    seCaseNg(event.target.value);
                                    setValue('case', event.target.value);
                                    clearErrors('case')
                                    event.target.value === "other" ? setotherCheck(true) : setotherCheck(false);
                                }}
                                className='h-11 w-full '
                                MenuProps={MenuProps}

                            >
                                <MenuItem disabled value="Placeholder">
                                    <em className='text-gray-500'>Placeholder </em>
                                </MenuItem>
                                {caseNgData && caseNgData.map(item => {
                                    return (
                                        <MenuItem key={item.code} value={item.code}>{item.code} {item.desc_th}</MenuItem>
                                    )
                                })}
                                <MenuItem value="other">
                                    [ other ]
                                </MenuItem>
                            </Select>
                        </div>
                        <div>
                            <p className={`mb-1 ${errors.qtyNg && 'text-red-500'}`}>Qty ng {errors.qtyNg?.message} </p>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={qtyNg}
                                // label="Age"
                                onChange={(event) => {
                                    setQtyNg(Number(event.target.value));
                                    setValue('qtyNg', Number(event.target.value));
                                    clearErrors('qtyNg')
                                }}
                                className='h-11 w-full '
                                MenuProps={MenuProps}


                            >
                                {qtyWOArray && qtyWOArray.map(item => {
                                    return (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    )
                                })}
                                {/* </div> past*/}
                            </Select>
                        </div>
                        <div hidden={!otherCheck} >
                            <div>
                                <p className={`mb-1 ${errors.other && 'text-red-500'}`}>Case other {errors.other && 'กรุณากรอก input'} </p>
                                <Input
                                    type='text' placeholder='Enter Case other'
                                    size='lg'
                                    {...register("other")}
                                    disabled={!otherCheck}
                                    className='border-gray-300'
                                />
                            </div>
                            <div className='mt-4 space-y-4'>
                                <div>
                                    <p className={`mb-1 ${errors.past && 'text-red-500'}`}>Past component {errors.past?.message} </p>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={past}
                                        onChange={(event) => {
                                            setPast(event.target.value);
                                            setValue('past', event.target.value);
                                            event.target.value === "other" ? setotherCheckPast(true) : setotherCheckPast(false);
                                            clearErrors('past')
                                        }}
                                        className='h-11 w-full'
                                        MenuProps={MenuProps}


                                    >
                                        <MenuItem disabled value="Placeholder">
                                            <em className='text-gray-500'>Placeholder </em>
                                        </MenuItem>
                                        {caseNgData && caseNgData.map(item => {
                                            return (
                                                <MenuItem key={item.code} value={item.code}>{item.code} {item.desc_th}</MenuItem>
                                            )
                                        })}
                                        <MenuItem value="other">
                                            [ other ]
                                        </MenuItem>
                                    </Select>
                                </div>
                                <div>
                                    <p className={`mb-1 ${errors.pastother && 'text-red-500'}`}>Past other {errors.pastother && 'กรุณากรอก input'} </p>
                                    <Input
                                        type='text' placeholder='Enter Case past other'
                                        size='lg'
                                        {...register("pastother")}
                                        disabled={!otherCheckPast}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <div className='mt-10 space-x-4'>
                                  <button
                                    className={`h-12 px-6 rounded-md border border-red-500 hover:border-red-700 text-red-500 hover:text-red-700 transition-colors duration-300 ease-in-out`}
                                    type='button'
                                    disabled={saveCheck}
                                    onClick={() => handleClose()}
                                >
                                    <div className='flex justify-center'>
                                        Close
                                    </div>
                                </button>
                                <button
                                    className={`h-12 px-6 rounded-md ${saveCheck ? 'bg-green-700' : 'bg-green-500'} text-white dark:text-black hover:bg-green-700 transition-colors duration-300 ease-in-out`}
                                    type='submit'
                                    disabled={saveCheck}
                                >
                                    <div className='flex justify-center'>
                                        {saveCheck ? <RenderCustomWhite /> : null}
                                        Save
                                    </div>
                                </button>
                              
                            </div>
                        </div>
                    </Container>
                </form>
            </Dialog>
        </React.Fragment>
    );
}



export const RenderCustomWhite = ({ className, strokeColor }: { className?: string, strokeColor?: string }) => {
    let stroke = strokeColor ? strokeColor : 'white'
    return (
        <div className={`mr-2 ${className}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader loader_custom_white">
                <line x1="12" x2="12" y1="2" y2="6" stroke={stroke} />
                <line x1="12" x2="12" y1="18" y2="22" stroke={stroke} />
                <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" stroke={stroke} />
                <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" stroke={stroke} />
                <line x1="2" x2="6" y1="12" y2="12" stroke={stroke} />
                <line x1="18" x2="22" y1="12" y2="12" stroke={stroke} />
                <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" stroke={stroke} />
                <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" stroke={stroke} />
            </svg>
        </div>

    )
}
