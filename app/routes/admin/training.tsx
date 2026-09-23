import { useState } from "react";
import type { Route } from "./+types/training";

export function loader() {
    return { name: "ML Training" };
}

export default function Training({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl">ML Training</h1>
            <div className="rounded-2xl bg-orange-100 border-1 p-4 m-3">
				<p><b>1.</b> Open the Teachable Machine website by clicking <a href="https://teachablemachine.withgoogle.com/train/" className="font-bold text-blue-500">HERE</a>.</p>
				<img className="rounded-2xl border-1" src="/training-steps/step-1.png" />
			</div>
			<div className="rounded-2xl bg-orange-100 border-1 p-4 m-3">
				<p><b>2.</b>  Start a New Teachable Machine Image Project with Standard Image model or open an TM project to continue training an existing model.</p>
				<img className="rounded-2xl border-1" src="/training-steps/step-2.png" />
			</div>
			<div className="rounded-2xl bg-orange-100 border-1 p-4 m-3">
				<p><b>3.</b>  Add Breed or Disease classes to specify the different breeds or diseases that you want the Breed Model or Disease Model to recognize.</p>
				<img className="rounded-2xl border-1" src="/training-steps/step-3.png" />
			</div>
			<div className="rounded-2xl bg-orange-100 border-1 p-4 m-3">
				<p><b>4.</b>  Upload images to the appropriate classes, gathered by you or from submissions from Veterinarians.</p>
				<img className="rounded-2xl border-1" src="/training-steps/step-4.png" />
			</div>
			<div className="rounded-2xl bg-orange-100 border-1 p-4 m-3">
				<p><b>5.</b>  After uploading images, press the Train Model button and wait for the training to complete.</p>
				<img className="rounded-2xl border-1" src="/training-steps/step-5.png" />
			</div>
			<div className="rounded-2xl bg-orange-100 border-1 p-4 m-3">
				<p><b>6.</b>  Use a webcam or image to test the model's prediction accuracy.</p>
				<img className="rounded-2xl border-1" src="/training-steps/step-6.png" />
			</div>
			<div className="rounded-2xl bg-orange-100 border-1 p-4 m-3">
				<p><b>7.</b>  When satisfied with the results, press Export Model and export a TFLite model with Quantized selected.</p>
				<img className="rounded-2xl border-1" src="/training-steps/step-7.png" />
			</div>
	<div className="rounded-2xl bg-orange-100 border-1 p-4 m-3">
    <p>
        <b>8.</b> Put the exported tflite file and labels text file to the Android
        project's assets folder. Replace the existing file if any and release a
        new app build with the newly trained model. You can find the exported
        model files <a
            href="https://drive.google.com/drive/u/1/folders/1crtSqOYJqtE7fbiZ_YipS2R0kThZUziX"
            className="font-bold text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
        >here</a>.
    </p>
    <img className="rounded-2xl border-1" src="/training-steps/step-8.png" />
</div>
        </div>
    );
}
