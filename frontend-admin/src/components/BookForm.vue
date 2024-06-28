<template>
    <Form @submit="submitBook" :validation-schema="contactFormSchema" class="row">
        <div class="col">
            <div class="form-group">
                <label for="image">Hình:</label>
                <Field name="image" type="url" class="form-control" id="image" v-model="bookLocal.hinh" />
                <ErrorMessage name="image" class="error-feedback" />
            </div>
            <div>
                <img v-if="bookLocal.hinh" :src="bookLocal.hinh" style="width: 400px;" class="img-fluid text-start">
                <div v-else>Không có ảnh</div>
            </div>
            <div class="form-group mt-3">
                <button class="btn btn-primary me-2">
                    <i class="fas fa-save"></i> Lưu
                </button>
                <button v-if="type == 'edit'" type="button" class="ml-2 btn btn-danger" @click="deleteBook">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
        <div class="col">
            <div class="form-group">
                <label for="id">Mã sách:</label>
                <Field name="id" type="text" class="form-control" v-model="bookLocal._id" />
                <ErrorMessage name="id" class="error-feedback" />
            </div>
            <div class="form-group">
                <label for="name">Tên sách:</label>
                <Field name="name" type="text" class="form-control" v-model="bookLocal.tensach" />
                <ErrorMessage name="name" class="error-feedback" />
            </div>
            <div class="form-group">
                <label for="type">Thể loại:</label>
                <Field name="type" type="text" class="form-control" v-model="bookLocal.theloai" />
                <ErrorMessage name="type" class="error-feedback" />
            </div>
            <div class="form-group">
                <label for="sotrang">Số trang:</label>
                <Field name="sotrang" type="number" class="form-control" v-model="bookLocal.sotrang" />
                <ErrorMessage name="sotrang" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="nxb">Nhà xuất bản:</label>
                <Field name="nxb" type="text" class="form-control" v-model="bookLocal.nxb" />
                <ErrorMessage name="nxb" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="price">Gia:</label>
                <Field name="price" type="text" inputmode="numeric" class="form-control" v-model="bookLocal.gia" />
                <ErrorMessage name="price" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="sq">Số quyển:</label>
                <Field name="sq" type="number" class="form-control" v-model="bookLocal.soquyen" />
                <ErrorMessage name="sq" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="nn">Ngôn ngữ:</label>
                <Field name="nn" type="text" class="form-control" v-model="bookLocal.ngonngu" />
                <ErrorMessage name="nn" class="error-feedback" />
            </div>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:book", "delete:book"],
    props: {
        book: { type: Object, required: true },
        type: { type: String, required: true }
    },
    data() {
        const contactFormSchema = yup.object().shape({
            id: yup
                .string()
                .required("Mã sách phải có giá trị.")
                .min(2, "Mã sách phải ít nhất 2 ký tự.")
                .max(50, "Mã sách có nhiều nhất 50 ký tự."),
            name: yup
                .string()
                .required("Tên sách phải có giá trị.")
                .min(2, "Tên sách phải ít nhất 2 ký tự."),
            image: yup
                .string()
                .required("Phải có ảnh"),
            type: yup
                .string()
                .required("Thể loại sách phải có giá trị"),
            sotrang: yup
                .number()
                .required("Số trang phải có giá trị")
                .min(10, "Sách phải có ít nhất 10 trang")
                .max(9999, "Sách tối đa có 9999 trang"),
            nxb: yup
                .string()
                .required("Tên nhà xuất bản phải có giá trị"),
            price: yup
                .number()
                .required("Giá sách phải có giá trị")
                .min(1000, "Giá sách phải ít nhất 1000")
                .max(100000000, "Giá sách không vượt quá 100000000"),
            sq: yup
                .number()
                .required("Số quyển phải có giá trị")
                .min(1, "Phải có ít nhất 1 quyển")
                .max(100, "Chứa tối đa được 100 quyển"),
            nn: yup
                .string()
                .required("Ngôn ngữ phải có giá trị"),
        });
        return {
            bookLocal: this.book,
            contactFormSchema,
        };
    },
    methods: {
        submitBook() {
            this.$emit("submit:book", this.bookLocal);
        },
        deleteBook() {
            this.$emit("delete:book", this.bookLocal.id);
        },

    },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>