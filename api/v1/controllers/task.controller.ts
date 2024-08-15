import {Request, Response} from "express"
import Task from "../models/task.model"
import paginationHelpers from "../../../helpers/pagination"
import searchHelpers from "../../../helpers/search"
export const index = async (req: Request, res: Response) => {
    // Find 
    interface Find {
        deleted : Boolean,
        status?: string,
        title?: RegExp
    }
    const find: Find = {
        deleted :false
    }
    if(req.query.status){
        find.status = req.query.status.toString()
    }
    // end find 

    //Search
    const objectSearch = searchHelpers(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }
    // End Search

    // Pagination
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelpers(
        {
            currentPage: 1,
            limitIteam: 2
        },
        req.query,
        countTasks
    )

    // End Pagination

    // Sort 
    const sort = {}
    
    if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey.toString()
        sort[sortKey] = req.query.sortValue
    }
    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitIteam)
    .skip(objectPagination.skip);

    res.json(tasks)
}


export const detail = async (req: Request, res: Response) => {
    const id:String = req.params.id
    const task = await Task.find({
        _id: id,
        deleted: false
    })

    res.json(task)
}


//[PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res:Response) => {
    try {
        const id:string = req.params.id
    
        const status:string = req.body.changeStatus

        await Task.updateOne({
            _id: id
        }, {
            status: status
        })
        res.json({
            code: 200,
            message: "Cập nhận trạng thái thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        })
    }
}


//[PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        enum Key {
            STATUS = "status",
            DELETE = "delete"
        }
        const { ids, key, value } = req.body

        switch (key) {
            case Key.STATUS:
                await Task.updateMany({
                    _id: {$in : ids }
                }, {
                    status: value
                })
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                })
                break;
            case Key.DELETE:
                await Task.updateMany({
                    _id: {$in : ids }
                }, {
                    deleted: true,
                    deleteAt: new Date
                })
                res.json({
                    code: 200,
                    message: "Xóa thành công"
                })
                break;
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!"
                })
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        })
    }
    
}

//[POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
    try {
        const product = new Task(req.body)
        const data = await product.save()

        res.json({
            code: 200,
            message: "Tạo thành công",
            data: data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
    
}

//[PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const id:string= req.params.id
        
        await Task.updateOne({ _id: id }, req.body)

        res.json({
            code: 200,
            message: "Cập nhật thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
    
}

//[DELETE] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id:string = req.params.id
        
        await Task.updateOne({ _id: id }, {
            deleted: true,
            deleteAt: new Date()
        })

        res.json({
            code: 200,
            message: "Xóa thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
    
}
