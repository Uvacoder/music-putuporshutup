import { getResetPassword } from "../api/auth";
import { $ } from "../utils/common";
import rules from "../utils/validate";
import toast from "../components/notification/toast";

const forgotPasswordPage = {
	render() {
		return /* html */ `
			<div class="min-h-screen w-full bg-base-100 flex justify-center items-center text-base-content">
				<a href="/#/" class="fixed top-5 left-5 z-10 text-base-content/60 hover:text-base-content"><i class="bi bi-arrow-left-short"></i> Back to dashboard</a>
				<div class="min-w-[320px] bg-base-200 glass sm:p-5 md:p-5 lg:p-10 xl:p-10 flex flex-col justify-center items-center rounded-box sm:rounded-none sm:min-h-screen sm:w-full">
					<img src="./assets/img/logo.png" alt="" class="max-w-full h-40 object-cover object-center" />
					<form action="" class="min-w-full">
						<div class="form-control gap-1 mb-5">
							<label for="" class="text-base-content/60">Email</label>
							<input type="email" name="email" data-name="Email" class="input" />
							<small class="error-message text-error"></small>
						</div>

						<div class="form-control gap-1 mb-5">
							<button type="submit" class="btn btn-primary normal-case btn-lg">Verify email</button>
						</div>
					</form>
				</div>
			</div>
		`;
	},
	handleEvents() {
		const form = $("form");
		if (form) {
			form.addEventListener("submit", async (event) => {
				try {
					event.preventDefault();
					const email = form["email"];
					if (!rules.areRequired(email)) return;
					if (!rules.isEmail(email)) return;
					/* send request */
					loadingScreen.showLoading();
					const response = await getResetPassword({ email: email.value });
					console.log("Response:::", response);
					if (response) {
						sessionStorage.setItem("email", email.value);
						window.location.href = "/reset-password";
						toast("success", "Check your email to get verify code!");
					}
					loadingScreen.hiddenLoading();
				} catch (error) {
					console.log(error);
				}
			});
		}
	},
};
export default forgotPasswordPage;
