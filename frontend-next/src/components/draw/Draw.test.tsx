import React from 'react';
import {render} from '@testing-library/react';
import { Draw } from './Draw';

describe("Draw Component", () => {
    describe("When user is logged in", () => {
        it("Should should the modal with the filename", async () => {
            const {findByText} = render(<Draw />);

            expect(await findByText("New Drawing")).toBeInTheDocument();

            // const ceva = "true";

            // expect(ceva).toBe("true");
        });

        // describe("When filename already exists", () => {
        //     it("Should display error", () => {

        //     });
        // });

        // describe("When filename is set successfully", () => {
        //     describe("When user wants to publish the drawing", () => {
        //         describe("When api publish request fails", () => {
        //             it("Should display a message", () => {

        //             });
        //         });

        //         describe("When api publish request succeeds", () => {
        //             it("Should redirect the user to the last page vidited before Draw", () => {

        //             });
        //         })
        //     })
        // });
    });
})